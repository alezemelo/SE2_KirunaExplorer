// (Dragos) I created this file because the others don't work and I absolutely have to finish for the frontend.

import pgdb from './temp_db';

async function temp_emptyDB() {
    try {
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