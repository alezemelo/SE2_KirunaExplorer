import express, { Request, Response, NextFunction, Router } from 'express';
import multer from 'multer';
import FileController from '../controllers/fileController';
import ErrorHandler from './helper';
import Authenticator from '../../authentication/auth';
import { UserType } from '../../models/user';
import { body, param } from 'express-validator';
import { FileInfo } from '../controllers/fileController';

export const files_dir_name = 'staticfiles';
const upload = multer({ dest: `${files_dir_name}/` });

// Middleware to check if a file was uploaded
const checkFilePresence = (req: any, res: any, next: any) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    next();
};

/**
 * Represents a class that defines the routes for handling document-related operations.
 */
class FileRoutes {
    private controller: FileController;
    private router: Router;
    private errorHandler: ErrorHandler;
    private authService: Authenticator;

    /**
     * Constructs a new instance of the DocumentRoutes class.
     */
    constructor(authenticator: Authenticator) {
        this.authService= authenticator;
        this.controller = new FileController();
        this.router = express.Router();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    /**
     * Initializes the routes for file-related operations.
     */
    private initRoutes() {
        /*
        * Upload a file and associate it with a document
        */
        this.router.post('/upload/:documentId', 
            this.authService.isLoggedIn,
            this.authService.isUserAuthorized(UserType.UrbanPlanner),
            param('documentId').notEmpty().isInt().toInt(),
            body('fileName').notEmpty().isString(),
            checkFilePresence,
            this.errorHandler.validateRequest,
            upload.single('file'),
            (req: any, res: any, next: any) => this.controller.mark_as_uploaded(req.params.id, req.body.fileName)
                .then((file_id: number) => res.status(200).json({ fileId: file_id }))
                .catch((err: any) => {next(err)})
        );            

        /*
        * Download a file given its ID
        */
        this.router.get('/download/:fileId',
            param('fileId').notEmpty().isInt().toInt(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.download(req.params.id)
                .then((file_url: any) => res.download(file_url))
                .catch((err: any) => {next(err)})
        );
        
        /*
        * Get all file ids AND names associated with a document.
        * I wanted to integreate this route into the document routes, but it requires too many modifications IMO
        *
        * @param documentId the ID of the document to get the file IDs for.
        * @returns an array of file IDs and names associated with the document.
        * @throws an error if the operation fails.
        * @throws 404 if the document does not exist.
        */
        this.router.get('/:documentId',
            param('documentId').notEmpty().isInt().toInt(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.get_file_ids_and_names(req.params.id)
                .then((file_ids_and_names: FileInfo[]) => res.status(200).json( file_ids_and_names )) // [{id: 1, name: 'file1'}, {id: 2, name: 'file2'}]
                .catch((err: any) => {next(err)})
        );

        /*
        * Get all file ids AND names. (all, regardless of document)
        *
        * @returns an array of file IDs and names.
        * @throws an error if the operation fails.
        * @throws 404 if no files are found.
        */
        this.router.get('/',
            (req: any, res: any, next: any) => this.controller.get_all_file_ids_and_names()
                .then((file_ids_and_names: FileInfo[]) => res.status(200).json( file_ids_and_names )) // [{id: 1, name: 'file1'}, {id: 2, name: 'file2'}]
                .catch((err: any) => {next(err)})
        );
    }

    /**
     * Returns the router instance.
     */
    public getRouter(): Router {
        return this.router;
    }
}

export default FileRoutes;