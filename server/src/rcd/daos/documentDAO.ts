
import {Client} from 'pg';
import pgdb from '../../db/temp_db';
import { dbUpdate } from '../../db/db_common_operations';
import db from '../../db/db';

import {Document} from '../../models/document';
import {Coordinates, CoordinatesAsPoint, CoordinatesType} from '../../models/coordinates';

class DocumentDAO {
    private db: any;

    constructor() {
        this.db = pgdb.client; 
    }

    public async getDocument(docId: number): Promise<Document | null> {
        try {
            const res = await db('documents').where({ id: docId }).first();
            if (!res) {
                return null;
            } else {
                return Document.fromJSON(res, db);
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
            let res = await pgdb.client.query('SELECT * FROM documents ORDER BY id', []);
            let documents:Document[] = []
            for(let i=0;i<res.rows.length;i++){
                let doc = await Document.fromJSON(res.rows[i],db)
                documents.push(doc)
            }
   
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
            const res = await pgdb.client.query(
                `SELECT * FROM documents where title ILIKE $1`, [param]);
                const documents: Document[] = await Promise.all(
                    res.rows.map(async (doc) => {
                        return await Document.fromJSON(doc, db);
                    })
                );
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
            if (newCoordinates.getType() === CoordinatesType.MUNICIPALITY){
                update_count = await dbUpdate('documents', {id: docId}, {coordinates_type: CoordinatesType.MUNICIPALITY, coordinates: null});
            } else {
                if (newCoordinates.getType() !== CoordinatesType.POINT && newCoordinates.getType() !== CoordinatesType.POLYGON) {
                    throw new Error("Invalid coordinates type. Shouldn't be possible");
                }
                const newType = newCoordinates.getType();
                const newWktCoords = newCoordinates.toGeographyString();
                update_count = await dbUpdate('documents', {id: docId}, {coordinates_type: newType, coordinates: newWktCoords});
            }

            return update_count;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addDocument(doc: any): Promise<void> {
        // console.log("dao")
        // console.log(doc)

        let coordinates = null;
        if(doc.coordinates.type==CoordinatesType.POINT){
            coordinates = new Coordinates(CoordinatesType.POINT,new CoordinatesAsPoint(doc.coordinates.coords.lat,doc.coordinates.coords.lng))
        }
        else if(doc.coordinates.type==CoordinatesType.MUNICIPALITY){
            coordinates = new Coordinates(CoordinatesType.MUNICIPALITY,null)
        }

        const query = `
            INSERT INTO documents 
            ( title, type, issuance_date, language, pages, stakeholders, scale, description,coordinates_type, coordinates, last_modified_by) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11)
        `;
        const values = [
            doc.title,
            doc.type,
            doc.issuanceDate ? doc.issuanceDate : null,
            doc.language,
            doc.pages,
            doc.stakeholders,
            doc.scale,
            doc.description,
            coordinates?.getType(),
            coordinates?.getCoords()?.toGeographyString(),
            doc.lastModifiedBy
        ];

        console.log(values)

        try {
            const res = await pgdb.client.query(query, values);
            if (res.rowCount !== 1) {
                throw new Error('Error adding document to the database');
            }
        } catch (error) {
            console.error('Error adding document to the database:', error);
            throw new Error('Database Error: Unable to add document');
        }
    }
}

export default DocumentDAO;
