import dayjs from "dayjs";
import FileDAO from "../daos/fileDAO";
import { files_dir_name } from "../routes/file_routes";

class NoFilesFoundError extends Error {
    code: number;
    constructor(message: string) {
        super(message);
        this.name = 'NoFilesFoundError';
        this.code = 404;
    }
}

export interface FileInfo {
    id: number;
    name: string;
}

/**
 * Represents a controller for handling file-related operations.
 */
class FileController {
    private dao: FileDAO;

    /**
     * Constructs a new instance of the FileController class.
     */
    constructor() {
        this.dao = new FileDAO();
    }

    /**
    * Marks a file as uploaded and associates it with a document.
    */
    async mark_as_uploaded(documentId: number): Promise<number> {
        try {
            const file_url = `${files_dir_name}/${documentId}`;
            
            // Update the files table with the file URL and get the assigned ID
            const file_id = await this.dao.mark_file_as_uploaded(file_url, dayjs.utc());

            if (!file_id) {
                throw new Error('Failed to mark the file as uploaded');
            }
            
            // Update the document_files table with the document ID and the file ID
            await this.dao.associate_file_with_document(documentId, file_id);

            return file_id;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Downloads a file.
     */
    async download(fileId: number): Promise<string> {
        try {
            const file = await this.dao.get_file(fileId);
            if (!file) {
                throw new Error('The file does not exist');
            }
            return file.file_url;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Retrieves the IDs AND the names of files associated with a document.
     */
    async get_file_ids_and_names(documentId: number): Promise<FileInfo[]> {
        try {
            const files = await this.dao.get_files(documentId);

            if (!files || files.length === 0) {
                throw new NoFilesFoundError('No files are associated with the document found');
            }

            const file_ids_and_names = files.map((file: any) => {
                return { id: file.id, name: file.file_name };
            });

            return file_ids_and_names;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Retrieves the IDs AND the names of all files
     * regardless of the document they are associated with.
     * 
     * @returns an array of file IDs and names.
     * @throws an error if the operation fails.
     * @throws 404 if no files are found.
     */
    async get_all_file_ids_and_names(): Promise<FileInfo[]> {
        try {
            const files = await this.dao.get_all_files();

            if (!files || files.length === 0) {
                throw new NoFilesFoundError('No files found');
            }

            const file_ids_and_names = files.map((file: any) => {
                return { id: file.id, name: file.file_name };
            });

            return file_ids_and_names;
        } catch (err) {
            throw err;
        }
    }
}

export default FileController;