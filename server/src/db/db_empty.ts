// The purpose of this file is just to quickly be able to empty the databse by just pressing run file.

import { dbEmpty } from "./db_common_operations";


if (require.main === module) {
    dbEmpty();
    console.log('Database emptied');
}