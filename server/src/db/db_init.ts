import { dbPopulateActualData, dbEmpty } from "./db_common_operations";
import knex from "./db";

async function dbInit() {
    await dbEmpty();
    await knex.migrate.latest();
    
    await dbPopulateActualData();
}

if (require.main === module) {
    dbInit();
}

export default dbInit;