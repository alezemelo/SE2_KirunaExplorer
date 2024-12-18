// (Dragos) I created this file because the others don't work and I absolutely have to finish for the frontend.


import pg from 'pg';

class my_pgDB {
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

    public async connect(retries: number = 5, delay: number = 5000) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await this.client.connect();
                console.log('Database connected successfully');
                return;
            } catch (error) {
                console.error(`Error connecting to the database (Attempt ${attempt} of ${retries}):`, error);
                if (attempt < retries) {
                    console.log(`Retrying in ${delay / 1000} seconds...`);
                    await new Promise(res => setTimeout(res, delay));
                } else {
                    console.error('Max retries reached. Could not connect to the database.');
                    throw error;
                }
            }
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

const pgdb = new my_pgDB();
pgdb.connect(); // Careful with open handles

export default pgdb;