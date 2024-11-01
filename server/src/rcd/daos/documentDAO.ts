import pg from 'pg';

const client = new pg.Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'kirunadb',
    password: 'kiruna07',
    port: 5432,
});

class DocumentDAO {
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

    public async getDocument(docId: number): Promise<Document> {
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