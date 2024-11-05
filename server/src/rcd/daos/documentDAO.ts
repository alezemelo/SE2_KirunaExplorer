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
    coordinates: string;
}



class DocumentDAO {
    private db: any;

    constructor() {
        this.db = pgdb.client; 
    }

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

    public async updateDescription(docId: number, newDescription: string): Promise<number> {
        try {
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
            const long = newCoordinates.long;
            const coordInfo = `SRID=4326;POINT(${long} ${lat})`;
            const updatedRows = await dbUpdate('documents', { id: docId }, { coordinates: coordInfo });
            //const res = await pgdb.client.query('UPDATE documents SET coordinates = $1 WHERE id = $2', [coordInfo, docId]);
            return updatedRows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addDocument(doc: any): Promise<number> {
        try {
            const { title, type, lastModifiedBy, issuanceDate, language, pages, stakeholders, scale, description, coordinates } = doc;

            const coordInfo = coordinates ? `SRID=4326;POINT(${coordinates.long} ${coordinates.lat})` : null;

            const [insertedId] = await this.db('documents')
                .insert({
                    title,
                    type,
                    last_modified_by: lastModifiedBy,
                    issuance_date: issuanceDate,
                    language,
                    pages,
                    stakeholders,
                    scale,
                    description,
                    coordinates: coordInfo,
                })
                .returning('id');

            console.log(`Document added with ID: ${insertedId}`);
            return insertedId;
        } catch (error) {
            console.error('Error adding document to the database:', error);
            throw new Error('Database Error: Unable to add document');
        }
    }
}

export default DocumentDAO;