// (Dragos) I created this file because the others don't work and I absolutely have to finish for the frontend.


import pg from 'pg';

class My_pgDB {
    client: pg.Client;

    constructor() {
        this.client = new pg.Client({
            user: 'postgres',
            // "database" instead of 127.0.0.1 to make it work with containers
            host: process.env.DATABASE_HOST_DEV || '127.0.0.1',
            //host: '127.0.0.1',
            database: 'kirunadb',
            password: 'kiruna07',
            port: 5432,
        });
    }

    public async connect() {
        try {
            await this.client.connect();
        } catch (error) {
            console.error('Error connecting to the database:', error);
            throw error;
        }
    }

    public async disconnect() {
        try {
            await this.client.end();
        } catch (error) {
            console.error('Error disconnecting from the database:', error);
            throw error;
        }
    }
}

const pgdb = new My_pgDB();
pgdb.connect(); // Careful with open handles

export default pgdb;