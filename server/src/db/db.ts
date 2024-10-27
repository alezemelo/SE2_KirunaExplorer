// TODO: currently the db connection is made with 'pg' library,
//CHANGE IT TO 'knex' library and use knex methods in db_common_operations.ts to interact with the database
import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'kirunadb',
    password: 'kiruna07',
    port: 5432,
});

export const closePool = async () => {
    try {
        await pool.end();
        console.log("Closed the db connedion pool.");
    } catch(e) {
        console.error("Error closing the db connection pool:", e);
    }
};