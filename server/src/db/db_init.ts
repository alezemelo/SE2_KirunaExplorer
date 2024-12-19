import { dbPopulateActualData, dbEmpty, removeUnwantedFilesFromStaticDirectory } from "./db_common_operations";
import knex from "./db";


async function dbInit() {
    try {
        await retryMigration();
        await dbEmpty();
        await removeUnwantedFilesFromStaticDirectory();
        await dbPopulateActualData();
    } catch (error) {
        console.error("Something went wrong during the initialization process:");
    }
}

async function retryMigration(retries = 5, delay = 5000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Attempting migration (attempt ${attempt} of ${retries})...`);
            await knex.migrate.latest();
            console.log('Migration completed successfully.');
            return; // Exit function once successful
        } catch (error) {
            console.error(`Migration failed on attempt ${attempt}:`, error);
            if (attempt === retries) {
                throw new Error("Migration failed after multiple attempts.");
            }
            console.log(`Retrying in ${delay / 1000} seconds...`);
            await new Promise(res => setTimeout(res, delay)); // Wait before retrying
        }
    }
}



async function dbInitMainmodule() {
    await dbInit();
    await knex.destroy();
}

if (require.main === module) {
    dbInitMainmodule();
    console.log('Database emptied and re-populated using knex');
}

export default dbInit;