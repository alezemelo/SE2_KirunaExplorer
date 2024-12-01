import pgdb from '../../db/temp_db';
import db from '../../db/db';
import { ForeignKeyConstraintError, UniqueConstraintError } from '../../errors/dbErrors';
class ScaleDAO {

    private db: any;

    constructor() {
        this.db = pgdb.client; 
    }

    /** 
     * @returns all scale values as array of strings, if nothing is found returns empty array
     * */
    public async getAllScales(): Promise<string[]> {
        try {
            const res = await db('scales').select('value');
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * adds a new scale value to the db
     * @param value the value of the new scale
     * @returns 
     */
    public async addScale(value: string): Promise<string> {
        try {
            const res = await db('scales')
                .insert({value})
                .returning('value');
            if (res.length !== 1) {
                throw new Error('Error adding scale to the database');
            }
            return res[0].value;
        } catch (error: any) {
            console.error('Error adding scale to the database:', error);
            if (error.code === '23505') { // PostgreSQL code for unique_violation
                throw new UniqueConstraintError();
            }
            throw error;
        }
    }

}

export default ScaleDAO;
