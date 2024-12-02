import dayjs from "dayjs";
import FileDAO from "../daos/fileDAO";
import { files_dir_name } from "../routes/file_routes";
import path from "path";

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
    async mark_as_uploaded(documentId: number, fileName: string): Promise<number> {
        try {
            const file_url = `http://localhost:3000/static/${fileName}`;
            
            // Update the files table with the file URL and get the assigned ID
            const file_id = await this.dao.mark_file_as_uploaded(file_url, fileName, dayjs.utc());
            
            if (!file_id) {
                throw new Error('Failed to mark the file as uploaded');
            }
            
            // Update the document_files table with the document ID and the file ID
            await this.dao.associate_file_with_document(documentId, file_id);
            console.error(`Inside mark_as_uploaded: file_id is ${file_id}`);
            
            return file_id;
        } catch (err) {
            console.log(`Error in mark_as_uploaded: ${err}`);
            throw err;
        }
    }

    /**
     * Downloads a file.
     */
    async get_file_location_in_server(fileId: number): Promise<string> {
        try {
            const file = await this.dao.get_file(fileId);
            if (!file) {
                throw new Error('The file does not exist');
            }

            const file_url = file.file_url;  // like http://localhost:3000/static/loremipsum.txt
            const file_name_with_extension = file_url.split('/').pop();  // like loremipsum.txt
            const file_location_in_server = path.join(files_dir_name, file_name_with_extension); 

            return file_location_in_server;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Retrieves the IDs AND the names of files associated with a document.
     */
    async get_file_ids_and_names(documentId: number): Promise<FileInfo[]> {
        try {
            // console.error(`Inside get_file_ids_and_names: documentId is ${documentId}`);

            const files = await this.dao.get_files(documentId);

            // if (!files || files.length === 0) {
            //     throw new NoFilesFoundError('No files are associated with the document found');
            // }

            const file_ids_and_names = files.map((file: any) => {
                console.log(`fileid = ${file.id}, filename = ${file.file_name}`);
                return { id: file.id, name: file.file_name };
            });

            return file_ids_and_names;
        } catch (err) {
            console.error(err);
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
            console.error(err)
            throw err;
        }
    }
}

export default FileController;