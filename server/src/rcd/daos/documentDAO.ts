
import { Client } from 'pg';
import pgdb from '../../db/temp_db';
import { dbUpdate } from '../../db/db_common_operations';
import db from '../../db/db';

import { Document } from '../../models/document';
import { Coordinates, CoordinatesAsPoint, CoordinatesType } from '../../models/coordinates';
import { groupEntriesById } from './helperDaos';
import { UniqueConstraintError } from '../../errors/dbErrors';
import { DocumentNotFoundError, DocumentTypeNotFoundError, ScaleNotFoundError, StakeholdersNotFoundError } from '../../errors/documentErrors';

class DocumentDAO {
    private db: any;

    constructor() {
        this.db = pgdb.client;
    }

    public async getDocument(docId: number): Promise<Document | null> {
        try {
            const res = await db('documents')
                .leftJoin('document_stakeholders', 'documents.id', '=', 'document_stakeholders.doc_id')
                .leftJoin('stakeholders', 'document_stakeholders.stakeholder_id', '=', 'stakeholders.name')
                .where({ 'documents.id': docId })
                .select('documents.*', 'stakeholders.name as stakeholder')
                .orderBy('stakeholders.name', 'asc');
            if (!res || res.length === 0) {
                return null;
            } else {
                const { stakeholder, ...docProps } = res[0];
                const document = { ...docProps, stakeholders: res.map(row => row.stakeholder) };
                return Document.fromJSON(document, db);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getDocuments(): Promise<Document[]> {
        try {
            /*let res = await pgdb.client.query('SELECT * FROM documents ORDER BY id', []);
            for(let i=0;i<res.rows.length;i++){
                if(res.rows[i].coordinates){
                    const coordinatesHex = Buffer.from(res.rows[i].coordinates, 'hex');
                    const c = await pgdb.client.query(
                        'SELECT ST_AsText(ST_GeomFromWKB($1::bytea)) as geom_text',
                        [coordinatesHex]
                      );
                      console.log(c)
                      const [long, lat] = c.rows[0].geom_text.replace("POINT(", "").replace(")", "").split(" ");
                      res.rows[i].coordinates = {
                        lat: parseFloat(lat),
                        lng: parseFloat(long) 
                    };
                }
            }
            return res.rows;*/
            //let res = await pgdb.client.query('SELECT * FROM documents ORDER BY id', []);
            const res = await db('documents')
                .leftJoin('document_stakeholders', 'documents.id', '=', 'document_stakeholders.doc_id')
                .leftJoin('stakeholders', 'document_stakeholders.stakeholder_id', '=', 'stakeholders.name')
                .select('documents.*', 'stakeholders.name as stakeholders')
                .orderBy('documents.id', 'asc');
            /*
            let documents:Document[] = []
            for(let i=0;i<res.rows.length;i++){
                let doc = await Document.fromJSON(res.rows[i],db)
                documents.push(doc)
            }
            */
            const documents = await groupEntriesById(res, db);
            return documents;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async searchDocuments(query: string): Promise<Document[]> {
        try {
            // gets readable format of coordinates directly from db instead of hex
            // if this query does not work, copy the for loop approach used in the method above
            /*const param = `%${query}%`;
            const res = await pgdb.client.query(
                `SELECT
                id, title, issuance_date, language, pages, stakeholders, scale, description, type,
                CASE WHEN coordinates IS NOT NULL
                    THEN
                        ST_AsText(ST_GeomFromWKB(coordinates))
                    ELSE NULL
                END as coordinates,
                last_modified_by
                FROM documents where title ILIKE $1`, [param]);
            return res.rows;*/
            const param = `%${query}%`;
            //const res = await pgdb.client.query(`SELECT * FROM documents where title ILIKE $1`, [param]);

            const res = await db('documents')
                .leftJoin('document_stakeholders', 'documents.id', '=', 'document_stakeholders.doc_id')
                .leftJoin('stakeholders', 'document_stakeholders.stakeholder_id', '=', 'stakeholders.name')
                .select('documents.*', 'stakeholders.name as stakeholders')
                .where('documents.title', 'ILIKE', `%${query}%`)
                .orderBy('documents.id', 'asc');

            const documents = groupEntriesById(res, db);
            return documents;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async updateDescription(docId: number, newDescription: string): Promise<number> {
        try {
            const res = await db('documents')
                .where({ id: docId })
                .update({ description: newDescription });

            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async updateCoordinates(docId: number, newCoordinates: Coordinates): Promise<number> {
        try {
            let update_count;
            if (newCoordinates.getType() === CoordinatesType.MUNICIPALITY) {
                update_count = await dbUpdate('documents', { id: docId }, { coordinates_type: CoordinatesType.MUNICIPALITY, coordinates: null });
            } else {
                if (newCoordinates.getType() !== CoordinatesType.POINT && newCoordinates.getType() !== CoordinatesType.POLYGON) {
                    throw new Error("Invalid coordinates type. Shouldn't be possible");
                }
                const newType = newCoordinates.getType();
                const newWktCoords = newCoordinates.toGeographyString();
                update_count = await dbUpdate('documents', { id: docId }, { coordinates_type: newType, coordinates: newWktCoords });
            }

            return update_count;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Overwrites a document's stakeholders, scale and/or type, depending on the body content.
     * 
     * @param id - The ID of the document to update.
     * @param body.stakeholders - The new stakeholders for the document (list of strings).
     * @param body.scale - The new scale for the document.
     * @param body.type - The new type for the document.
     */
    public async updateDocument(id: number, body: any): Promise<void> {
        try {
            await db.transaction(async (trx) => {

                // checks if doc exists
                const documentExists = await trx('documents')
                    .where({ id })
                    .first();

                if (!documentExists) {
                    throw new Error(`Document with ID ${id} does not exist.`);
                }

                if (body.scale) {
                    await trx('documents')
                        .where({ id })
                        .update({ scale: body.scale });
                }
                if (body.doctype) {
                    await trx('documents')
                        .where({ id })
                        .update({ type: body.doctype });
                }
                if (body.stakeholders) {
                    const deletedRows = await trx('document_stakeholders')
                        .where({ doc_id: id })
                        .delete();
                    console.log(`Deleted ${deletedRows} rows for document with ID ${id}.`);
                    if (body.stakeholders.length > 0) {
                        console.log("adding new stakeholders...")
                        const stakeholdersRows = body.stakeholders.map((stakeholder: any) => ({
                        doc_id: id,
                        stakeholder_id: stakeholder,
                        }));
                        console.log(stakeholdersRows)
                        await trx('document_stakeholders').insert(stakeholdersRows);
                    }
                }
            });
        } catch (error: any) {
            console.error(`Failed to update document with ID ${id}:`, error);
            if (error.message.includes('does not exist')) {
                // Handle the case where the document does not exist
                throw new DocumentNotFoundError([body.id]);
            }
            if (error.code === '23503' && error.message.includes('documents_type_foreign')) {
                throw new DocumentTypeNotFoundError();
            }
            if (error.code === '23503' && error.message.includes('documents_scale_foreign')) {
                throw new ScaleNotFoundError();
            }
            if (error.code === '23503' && error.message.includes('document_stakeholders_stakeholder_id_foreign')) {
                throw new StakeholdersNotFoundError();
            }
            throw error;
        }
    }


    /**
     * Adds a new document and links it with stakeholders if they are present
     * @param doc The document to add
     * @returns 
     */
    public async addDocument(doc: Document): Promise<number> {

        /* This is not really needed if you use Document instead of any for doc, but I'll leave it here for reference */
        // let coordinates = null;
        //
        // if (doc.coordinates?.type === 'POINT') {
        //     if (!doc.coordinates.coords?.lat || !doc.coordinates.coords?.lng) {
        //         throw new Error('Invalid POINT coordinates: lat and lng are required');
        //     }
        //     coordinates = new Coordinates(
        //         CoordinatesType.POINT,
        //         new CoordinatesAsPoint(doc.coordinates.coords.lat, doc.coordinates.coords.lng)
        //     );
        // } else if (doc.coordinates?.type === 'MUNICIPALITY') {
        //     coordinates = new Coordinates(CoordinatesType.MUNICIPALITY, null);
        // } else {
        //     throw new Error('Invalid coordinates type');
        // }
        //
        // doc.setCoordinates(coordinates);
        //
        // const query = `
        //     INSERT INTO documents 
        //     (title, type, issuance_date, language, pages, stakeholders, scale, description, coordinates_type, coordinates, last_modified_by)
        //     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        //     RETURNING id;
        // `;
        // const values = [
        //     doc.title,
        //     doc.type,
        //     doc.issuanceDate || null,
        //     doc.language,
        //     doc.pages,
        //     doc.stakeholders,
        //     doc.scale,
        //     doc.description,
        //     coordinates.getType(),
        //     coordinates.getCoords()?.toGeographyString(),
        //     doc.lastModifiedBy,
        // ];
        /* */

        console.error(doc.coordinates instanceof Coordinates);

        try {
            // starts a transaction

            //console.log(doc);
            const document_to_insert = doc.toObjectWithoutIdAndStakeholders();

            const documentId = await db.transaction(async (trx) => {
                // Insert the document
                const res = await trx('documents')
                    .insert(document_to_insert)
                    .returning('id');
    
                if (res.length !== 1) {
                    throw new Error('Error adding document to the database');
                }
                const documentId = res[0].id;
    
                // Insert the stakeholders relationships
                if (doc.stakeholders && doc.stakeholders.length > 0) {
                    const stakeholdersRows = doc.stakeholders.map((stakeholder) => ({
                        doc_id: documentId,
                        stakeholder_id: stakeholder,
                    }));
    
                    await trx('document_stakeholders').insert(stakeholdersRows);
                }
    
                // Return the document ID if all operations succeed
                return documentId;
            });
            
            return documentId;

            /*
            const res = await db('documents')
                .insert(doc.toObjectWithoutIdAndStakeholders())
                .returning('id');
            if (res.length !== 1) {
                throw new Error('Error adding document to the database');
            }
            return res[0].id;
            */
        } catch (error: any) {
            console.error('Error adding document to the database:', error);
            if (error.code === '23505') {
                throw new UniqueConstraintError();
            }
            if (error.code === '23503' && error.message.includes('documents_type_foreign')) {
                throw new DocumentTypeNotFoundError();
            }
            if (error.code === '23503' && error.message.includes('document_stakeholders_stakeholder_id_foreign')) {
                throw new StakeholdersNotFoundError();
            }
            if (error instanceof Error && (error as any).code === 'XX000') {
                throw new Error('Invalid geometry: Ensure coordinates are valid and formatted correctly.');
            } else {
                throw error;
            }
        }
    }


}



export default DocumentDAO;
