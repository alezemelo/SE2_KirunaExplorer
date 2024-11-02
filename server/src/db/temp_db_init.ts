// (Dragos) I created this file because the others don't work and I absolutely have to finish for the frontend.

import pgdb from "./temp_db";
import temp_emptyDB from "./temp_db_empty";
import temp_populateDB from "./temp_db_population";

// (Dragos) You only have documents 15, 18 and 41 so far in the db (at least for this temp version of mine)

async function temp_init() {
    await temp_emptyDB();
    await temp_populateDB();
    await pgdb.disconnect();
    console.log('Database initialized (empty -> populate).');
}

if (require.main === module) {
    temp_init();
}