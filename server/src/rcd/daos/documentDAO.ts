import {Client} from 'pg';
import pgdb from '../../db/temp_db';
import {Document} from '../../models/document';
import { Coordinates } from '../controllers/documentController';
import { dbUpdate } from '../../db/db_common_operations';

interface LocalDocument {
    title: string;
    type: string;
    lastModifiedBy: string;
    issuanceDate: Date;
    language: string;
    pages: number;
    stakeholders: string[];
    scale: string;
    description: string;
    coordinates: Coordinates;
}



class DocumentDAO {
    public async getDocument(docId: number): Promise<Document | null> {
        
        try {
            const res = await pgdb.client.query('SELECT * FROM documents WHERE id = $1', [docId]);
            if (res.rows.length === 0) {
                return null;
            } else {
                return Document.fromJSON(res.rows[0]);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getDocuments(): Promise<Document[]> {
        try {
            const res = await pgdb.client.query('SELECT * FROM documents ', []);
            for(let i=0;i<res.rows.length;i++){
                if(res.rows[i].coordinates){
                    const coordinatesHex = Buffer.from(res.rows[i].coordinates, 'hex');
                    const c = await pgdb.client.query(
                        'SELECT ST_AsText(ST_GeomFromWKB($1::bytea)) as geom_text',
                        [coordinatesHex]
                      );
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
            console.log(newDescription)
            const res = await pgdb.client.query('UPDATE documents SET description = $1 WHERE id = $2', [newDescription, docId]);
            if (res.rowCount) {
                return res.rowCount;
            } else {
                return 0;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async updateCoordinates(docId: number, newCoordinates: Coordinates): Promise<number> {
        try {
            const lat = newCoordinates.lat;
            const long = newCoordinates.lng;
            console.log(newCoordinates)
            const coordInfo = `SRID=4326;POINT(${long} ${lat})`;
            const updatedRows = await dbUpdate('documents', { id: docId }, { coordinates: coordInfo });
            //const res = await pgdb.client.query('UPDATE documents SET coordinates = $1 WHERE id = $2', [coordInfo, docId]);
            return updatedRows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addDocument(doc: Document): Promise<void> {
        console.log("dao")
        console.log(doc)


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
            doc.coordinates ? `SRID=4326;POINT(${doc.coordinates.lat} ${doc.coordinates.lng})`: null,
            "admin"
        ];

        try {
            const res = await pgdb.client.query(query, values);
            if (res.rowCount !== 1) {
                throw new Error('Error adding document to the database');
            }
        } catch (error) {
            console.error('Failed to add document:', error);
            throw error;
        }
    }
}

export default DocumentDAO;