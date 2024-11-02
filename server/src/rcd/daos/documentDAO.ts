import pg from 'pg';
import { Document } from '../../models/document';
import { DocumentNotFoundError } from '../../errors/documentErrors';


const client = new pg.Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'kirunadb',
    password: 'kiruna07',
    port: 5432,
});

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
    client: any;
    constructor() {
        this.connect();
    }

    private async connect() {
        try {
            await client.connect();
        } catch (error) {
            console.error('Error connecting to the database:', error);
            throw error;
        }
    }

    public async addDocument(doc: Document): Promise<void> {
        const query = `
            INSERT INTO documents 
            (id, title, type, last_modified_by, issuance_date, language, pages, stakeholders, scale, description, coordinates) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;
        const values = [
            doc.id,
            doc.title,
            doc.type,
            doc.lastModifiedBy,
            doc.issuanceDate ? doc.issuanceDate.toISOString() : null,
            doc.language,
            doc.pages,
            doc.stakeholders,
            doc.scale,
            doc.description,
            doc.coordinates
        ];

        try {
            const res = await this.client.query(query, values);
            if (res.rowCount !== 1) {
                throw new Error('Error adding document to the database');
            }
        } catch (error) {
            console.error('Failed to add document:', error);
            throw error;
        }
    }

    public async getDocument(docId: number): Promise<LocalDocument> {
        try {
            const res = await client.query('SELECT * FROM documents WHERE id = $1', [docId]);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async updateDescription(docId: number, newDescription: string): Promise<number> {
        try {
            const res = await client.query('UPDATE documents SET description = $1 WHERE id = $2', [newDescription, docId]);
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

    public async disconnect() {
        try {
            await client.end();
        } catch (error) {
            console.error('Error disconnecting from the database:', error);
            throw error;
        }
    }
}

export default DocumentDAO;