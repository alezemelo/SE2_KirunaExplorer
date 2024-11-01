import temp_emptyDB from "./temp_db_empty";
import temp_populateDB from "./temp_db_population";

// (Dragos) You only have documents 15, 18 and 41 so far in the db (at least for this temp version of mine)

async function temp_init() {
    await temp_emptyDB();
    await temp_populateDB();
}

if (require.main === module) {
    temp_init();
}