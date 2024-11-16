import { dbPopulateActualData, dbEmpty } from "./db_common_operations";
import knex from "./db";

async function dbInit() {
    await knex.migrate.latest();
    await dbEmpty();
    await dbPopulateActualData();
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