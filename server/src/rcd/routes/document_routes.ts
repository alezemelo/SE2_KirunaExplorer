import express, { Router } from "express";
import ErrorHandler from "./helper";
import { body, param } from "express-validator";

import { DocumentNotFoundError } from "../../errors/documentErrors";
import DocumentController from "../controllers/documentController";

/**
 * Represents a class that defines the routes for handling document-related operations.
 */
class DocumentRoutes {
    private controller: DocumentController;
    private router: Router;
    private errorHandler: ErrorHandler;

    /**
     * Constructs a new instance of the DocumentRoutes class.
     */
    constructor() {
        this.controller = new DocumentController();
        this.router = express.Router();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    /**
     * Initializes the routes for document-related operations.
     */
    private initRoutes() {

        /**
         * POST /documents/:id/description
         * Updates the description of a document.
         * 
         * Request Parameters:
         * - id: The ID of the document to update (must be an integer).
         * 
         * Request Body:
         * - description: The new description for the document (must be a string with length between 1 and 2000 characters).
         * 
         * Response:
         * - 200 OK: If the description was successfully updated.
         * - 404 Not Found: If the document with the specified ID is not found.
         * - 422 Unprocessable Entity: If the request validation fails.
         * - TODO 401 Unauthorized: If the user is not logged in.
         * - 500 Internal Server Error: If an unexpected error occurs.
         */
        this.router.post(
            '/:id/description',
            // TODO remember to enable when there's the authenticator plss
            // (req: any, res: any, next: any) => this.authenticator.isLoggedIn(req, res, next),
            // (req: any, res: any, next: any) => this.authenticator.isUrbanPlanner(req, res, next),
            param('id').isInt().toInt(),
            body('description').isString().isLength({ max: 2000 }),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.updateDescription(req.param.id, req.body.description)   
                .then(() => res.status(200).end())
                .catch((err: any) => {
                    next(err)
                })
        );

        this.router.get(
            `/:id`,
            // TODO remember to enable when there's the authenticator plss
            // (req: any, res: any, next: any) => this.authenticator.isLoggedIn(req, res, next),
            // (req: any, res: any, next: any) => this.authenticator.isUrbanPlanner(req, res, next),
            param('id').isInt().toInt(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.getDocument(req.params.id)
                .then((document: any) => res.status(200).json(document))
                .catch((err: any) => {
                    if (err instanceof DocumentNotFoundError) {
                        res.status(404).end();
                    } else {
                        next(err);
                    }
                })
        )
    }

    /**
     * Returns the router instance.
     */
    public getRouter(): Router {
        return this.router;
    }
}

export default DocumentRoutes;