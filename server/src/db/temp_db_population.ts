// (Dragos) I created this file because the others don't work and I absolutely have to finish for the frontend.

import documents from './actual_data/documents';
import { SAMPLE_USERS } from './sample_data/sample_users';

import pg from 'pg';

const client = new pg.Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'kirunadb',
    password: 'kiruna07',
    port: 5432,
});

// Don't want to change db strucutre so I'll just cut description to 255 characters
for (const doc of documents) {
    if (doc.description) {
        doc.description = doc.description.substring(0, 254);
    }
}

async function temp_populateDB() {
    try {
        await client.connect();

        //

        // Populate users
        for (const user of SAMPLE_USERS) {
            try {
                const res = await client.query(
                    'INSERT INTO users (username, hash, salt, type) VALUES ($1, $2, $3, $4)',
                    [user.username, user.hash, user.salt, user.type]
                );
                // console.log(res);
            } catch (error) {
                console.error(error);
            }
        }

        // Populate documents
        for (const doc of documents) {
            try {
                const res = await client.query(
                    'INSERT INTO documents (id, title, type, last_modified_by, issuance_date, language, pages, stakeholders, scale, description, coordinates) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
                    [
                        doc.id,
                        doc.title,
                        doc.type,
                        doc.lastModifiedBy,
                        doc.issuanceDate,
                        doc.language,
                        doc.pages,
                        doc.stakeholders,
                        doc.scale,
                        doc.description,
                        doc.coordinates,
                    ]
                );
                // console.log(res);
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await client.end();
    }
}

if (require.main === module)
    temp_populateDB();

export default temp_populateDB;

