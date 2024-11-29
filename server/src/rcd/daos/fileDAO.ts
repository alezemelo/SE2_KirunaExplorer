import { Dayjs } from 'dayjs';
import db from '../../db/db'; // is knex

class FileDAO {

    /* 
    * Adds a file with its URL in the files table.
    *
    * @param file_url the URL of the file to be added.
    * @param uploaded_at the date and time the file was uploaded.
    * @returns the ID of the newly added file.
    * @throws an error if the operation fails.
    */
    public async mark_file_as_uploaded(file_url: string, uploaded_at: Dayjs): Promise<number> {
        try {
            const [file_id] = await db('files').insert({ file_url, uploaded_at }).returning('id');
            return file_id;
        } catch (err) {
            throw err;
        }
    }

    /*
    * Associates a file with a document in the document_files table.
    *
    * @param documentId the ID of the document to associate the file with.
    * @param file_id the ID of the file to associate with the document.
    * @throws an error if the operation fails.
    */
    public async associate_file_with_document(documentId: number, file_id: number): Promise<void> {
        try {
            await db('document_files').insert({ document_id: documentId, file_id });
        } catch (err: any) {
            // Check for foreign key and primary constraint violation
            if (err.code === '23503') {
                throw new Error('The document ID or file ID does not exist');
            } else if (err.code === '23505') {
                throw new Error('The file is already associated with the document');
            } else {
                throw err;
            }
        }
    }

    /* 
    * Retrieves a file from the files table.
    */
    public async get_file(fileId: number): Promise<any> {
        try {
            const file = await db('files').where('id', fileId).first();
            return file;
        } catch (err) {
            throw err;
        }
    }

    /* 
    * Retrieves all matching files from the files table.
    */
    public async get_files(documentId: number): Promise<any[]> {
        try {
            const files = await db('document_files').where('document_id', documentId);
            return files;
        } catch (err) {
            throw err;
        }
    }

    /*
    * Retrieves all files from the files table.
    */
    public async get_all_files(): Promise<any[]> {
        try {
            const files = await db('files');
            return files;
        } catch (err) {
            throw err;
        }
    }
}



export default FileDAO;
