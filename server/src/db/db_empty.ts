// The purpose of this file is just to quickly be able to empty the databse by just pressing run file.

import { dbEmpty } from "./db_common_operations";
import knex from "./db";

async function dbEmptyMainmodule() {
    await dbEmpty();
    await knex.destroy();
}

if (require.main === module) {
    dbEmptyMainmodule();
    console.log('Database emptied');
}