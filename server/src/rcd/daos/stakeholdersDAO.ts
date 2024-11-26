import pgdb from '../../db/temp_db';
import { dbUpdate } from '../../db/db_common_operations';
import db from '../../db/db';
import { ForeignKeyConstraintError, UniqueConstraintError } from '../../errors/dbErrors';
class StakeholdersDAO {

    private db: any;

    constructor() {
        this.db = pgdb.client; 
    }

    // returns true only if every stakeholder name is in the db
    public async stakeholdersExists(names: string[]): Promise<boolean> {
        try {
            const res = await db('stakeholders')
                .whereIn('name', names)
                .count('name as count')
                .first();
            return res?.count === names.length;
            /*
            if (!res) {
                return null;
            } else {
                return true;
            }
            */
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // returns all stakeholder names as strings, if nothing is found returns empty array
    public async getAllStakeholders(): Promise<string[]> {
        try {
            const res = await db('stakeholders').select('name');
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addStakeholder(name: string): Promise<string> {
        try {
            const res = await db('stakeholders')
                .insert({name})
                .returning('name');
            if (res.length !== 1) {
                throw new Error('Error adding stakeholder to the database');
            }
            return res[0].name;
        } catch (error: any) {
            console.error('Error adding stakeholder to the database:', error);
            if (error.code === '23505') { // PostgreSQL code for unique_violation
                throw new UniqueConstraintError();
            }
            throw error;
        }
    }

    /**
     * Adds stakeholder-doc connections
     *
     */
    public async addStakeholdersToDocument(stakeholder_names: string[], docId: number): Promise<number> {
       try {
        const rowsToInsert = stakeholder_names.map(name => ({
            doc_id: docId,
            stakeholder_id: name
        }));
        const res = await db('document_stakeholders')
            .insert(rowsToInsert);
        return res.length;
       } catch (error: any) {
            if (error.code === '23505') { // PostgreSQL code for unique_violation
                throw new UniqueConstraintError();
            }
            if (error.code === '23503') { // PostgreSQL code for foreign_key_violation
                throw new ForeignKeyConstraintError();
            }
            console.error("Error in adding stakeholders to document");
            throw error;
       } 
    }

    /**
     * Deletes stakeholder-doc connections
     * @param stakeholder_names - Array of stakeholder names to remove
     * @param docId - ID of the document
     * @returns Number of rows deleted
     */
    public async removeStakeholdersFromDocument(stakeholder_names: string[], docId: number): Promise<number> {
       try {
        const res = await db('document_stakeholders')
            .where('doc_id', docId)
            .whereIn('stakeholder_id', stakeholder_names)
            .delete();
        return res;
       } catch (error: any) {
            console.error("Error in removing stakeholders from document");
            throw error;
       } 
    }
}

export default StakeholdersDAO;