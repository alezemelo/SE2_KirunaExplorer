// (Dragos) I created this file because the others don't work and I absolutely have to finish for the frontend.

import pgdb from './temp_db';

async function temp_emptyDB() {
    try {
        // Disable constraints
        await pgdb.client.query('ALTER TABLE documents DISABLE TRIGGER ALL');
        await pgdb.client.query('ALTER TABLE users DISABLE TRIGGER ALL');
        await pgdb.client.query('ALTER TABLE document_links DISABLE TRIGGER ALL');
        await pgdb.client.query('ALTER TABLE document_files DISABLE TRIGGER ALL');
        await pgdb.client.query('ALTER TABLE files DISABLE TRIGGER ALL');

        // Empty documents
        try {
            const res = await pgdb.client.query('DELETE FROM documents');
            // console.log(res);
        } catch (error) {
            console.error(error);
        }

        // Empty users
        try {
            const res = await pgdb.client.query('DELETE FROM users');
            // console.log(res);
        } catch (error) {
            console.error(error);
        }

        // Empty document_links
        try {
            const res = await pgdb.client.query('DELETE FROM document_links');
            // console.log(res);
        } catch (error) {
            console.error(error);
        }

        // Empty document_files
        try {
            const res = await pgdb.client.query('DELETE FROM document_files');
            // console.log(res);
        } catch (error) {
            console.error(error);
        }

        // Empty files
        try {
            const res = await pgdb.client.query('DELETE FROM files');
            // console.log(res);
        } catch (error) {
            console.error(error);
        }

        // // Enable constraints
        // await pgdb.client.query('ALTER TABLE documents ENABLE TRIGGER ALL');
        // await pgdb.client.query('ALTER TABLE users ENABLE TRIGGER ALL');
        // await pgdb.client.query('ALTER TABLE document_links ENABLE TRIGGER ALL');
        // await pgdb.client.query('ALTER TABLE document_files ENABLE TRIGGER ALL');
        // await pgdb.client.query('ALTER TABLE files ENABLE TRIGGER ALL');

    } catch (error) {
        console.error(error);
        if (require.main === module) {
            throw error;
        }
    }
}

async function run() {
    await temp_emptyDB();
    await pgdb.disconnect();
    console.log('Database emptied.');
}

if (require.main === module) {
    run();
}

export default temp_emptyDB;