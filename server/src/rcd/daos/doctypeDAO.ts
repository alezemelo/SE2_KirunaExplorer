import pgdb from '../../db/temp_db';
import db from '../../db/db';
import { ForeignKeyConstraintError, UniqueConstraintError } from '../../errors/dbErrors';
class DoctypeDAO {

    private db: any;

    constructor() {
        this.db = pgdb.client; 
    }

    /** 
     * @returns all doctype names as array of strings, if nothing is found returns empty array
     * */     public async getAllDoctypes(): Promise<string[]> {
        try {
            const res = await db('doctypes').select('name');
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * adds a new doctype name to the db
     * @param name the name of the new doctype
     * @returns 
     */
    public async addDoctype(name: string): Promise<string> {
        try {
            const res = await db('doctypes')
                .insert({name})
                .returning('name');
            if (res.length !== 1) {
                throw new Error('Error adding doctype to the database');
            }
            return res[0].name;
        } catch (error: any) {
            console.error('Error adding doctype to the database:', error);
            if (error.code === '23505') { // PostgreSQL code for unique_violation
                throw new UniqueConstraintError();
            }
            throw error;
        }
    }

}

export default DoctypeDAO;
