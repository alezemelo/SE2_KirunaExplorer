
import { Client } from 'pg';
import pgdb from '../../db/temp_db';
import { dbUpdate } from '../../db/db_common_operations';
import db from '../../db/db';

import { Document } from '../../models/document';
import { Coordinates, CoordinatesAsPoint, CoordinatesType } from '../../models/coordinates';
import { groupEntriesById } from './helperDaos';

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
            if (!res) {
                return null;
            } else {
                const document = { ...res, stakeholders: res.map(row => row.stakeholder) };
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
            const documents = groupEntriesById(res);
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

            const documents = groupEntriesById(res);
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
            const res = await db('documents')
                .insert(doc.toObjectWithoutIdAndStakeholders())
                .returning('id');
            if (res.length !== 1) {
                throw new Error('Error adding document to the database');
            }
            return res[0].id;
        } catch (error) {
            console.error('Error adding document to the database:', error);
            if (error instanceof Error && (error as any).code === 'XX000') {
                throw new Error('Invalid geometry: Ensure coordinates are valid and formatted correctly.');
            } else {
                throw error;
            }
        }
    }


}



export default DocumentDAO;
