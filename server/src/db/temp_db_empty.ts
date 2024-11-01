// (Dragos) I created this file because the others don't work and I absolutely have to finish for the frontend.

import pg from 'pg';

const client = new pg.Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'kirunadb',
    password: 'kiruna07',
    port: 5432,
});

async function temp_emptyDB() {
    try {
        await client.connect();

        // Empty documents
        try {
            const res = await client.query('DELETE FROM documents');
            // console.log(res);
        } catch (error) {
            console.error(error);
        }

        // Empty users
        try {
            const res = await client.query('DELETE FROM users');
            // console.log(res);
        } catch (error) {
            console.error(error);
        }

    } catch (error) {
        console.error(error);
    } finally {
        await client.end();
    }
}

if (require.main === module) {
    temp_emptyDB();
}

export default temp_emptyDB;