import { dbPopulateActualData, dbEmpty } from "./db_common_operations";
import knex from "./db";

async function dbInit() {
    await knex.migrate.latest();
    await dbEmpty();
    await dbPopulateActualData();
}

if (require.main === module) {
    dbInit();
}

export default dbInit;