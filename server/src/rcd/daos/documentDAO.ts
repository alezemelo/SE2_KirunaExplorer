import {Client} from 'pg';
import pgdb from '../../db/temp_db';
import {Document} from '../../models/document';
import { Coordinates } from '../controllers/documentController';
import { dbUpdate } from '../../db/db_common_operations';

import db from '../../db/db';

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
                return Document.fromJSON(res);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getDocuments(): Promise<Document[]> {
        try {
            const res = await pgdb.client.query('SELECT * FROM documents ORDER BY id', []);
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
            return res.rows;
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
            const lat = newCoordinates.lat;
            const long = newCoordinates.lng;
            // console.log(newCoordinates)
            const coordInfo = `SRID=4326;POINT(${long} ${lat})`;
            const updatedRows = await dbUpdate('documents', { id: docId }, { coordinates: coordInfo });
            //const res = await pgdb.client.query('UPDATE documents SET coordinates = $1 WHERE id = $2', [coordInfo, docId]);
            return updatedRows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addDocument(doc: any): Promise<void> {
        // console.log("dao")
        // console.log(doc)


        let coordinates = null;

        const query = `
            INSERT INTO documents 
            ( title, type, issuance_date, language, pages, stakeholders, scale, description, coordinates, last_modified_by) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
            doc.coordinates ? `SRID=4326;POINT(${doc.coordinates.lng} ${doc.coordinates.lat})`: null,
            "admin"
        ];

        console.log(doc.coordinates)

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