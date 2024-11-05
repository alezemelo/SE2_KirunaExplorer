import express, { Router } from "express";
import ErrorHandler from "./helper";
import { body, param } from "express-validator";
import Authenticator from "../../authentication/auth";
import { UserType } from "../../models/user";

import { DocumentNotFoundError } from "../../errors/documentErrors";
import DocumentController from "../controllers/documentController";

/**
 * Represents a class that defines the routes for handling document-related operations.
 */
class DocumentRoutes {
    addDocument(arg0: string, addDocument: any) {
        throw new Error("Method not implemented.");
    }
    private controller: DocumentController;
    private router: Router;
    private errorHandler: ErrorHandler;
    private authenticator: Authenticator;

    /**
     * Constructs a new instance of the DocumentRoutes class.
     */
    constructor(authenticator: Authenticator) {
        this.authenticator = authenticator;
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
            //this.authenticator.isLoggedIn,
            //this.authenticator.isUserAuthorized(UserType.UrbanPlanner),
            param('id').isInt().toInt(),
            body('description').isString().isLength({ max: 2000 }),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.updateDescription(req.params.id, req.body.description)   
                .then(() => res.status(200).end())
                .catch((err: any) => {
                    next(err)
                })
        );

        /* 
        * GET /documents/:id
        * Retrieves a document by its ID.
        * 
        * Request Parameters:
        * - id: The ID of the document to retrieve (must be an integer).
        * 
        * Response:
        * - 200 OK: If the document was successfully retrieved.
        * - 404 Not Found: If the document with the specified ID is not found.
        * - 422 Unprocessable Entity: If the request validation fails.
        * - 500 Internal Server Error: If an unexpected error occurs.
        */
        this.router.get(
            `/:id`,
            param('id').isInt().toInt(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.getDocument(req.params.id)
                .then((document: any) => res.status(200).json(document))
                .catch((err: any) => {
                    next(err)
                })
        )

        this.router.get(
            `/`,
            (req: any, res: any, next: any) => this.controller.getDocuments()
                .then((documents: any) => res.status(200).json(documents))
                .catch((err: any) => {
                    next(err)
                })
        )

        this.router.post(
            '/',
            // TODO remember to enable when there's the authenticator plss
            // (req: any, res: any, next: any) => this.authenticator.isLoggedIn(req, res, next),
            // (req: any, res: any, next: any) => this.authenticator.isUrbanPlanner(req, res, next),
            //body('id').isInt(),
            body('title').isString(),
            body('type').isString(),
            body('lastModifiedBy').isString(),
            body('issuanceDate').optional().isISO8601(),
            body('language').optional().isString(),
            body('pages').optional().isInt(),
            body('stakeholders').optional().isString(),
            body('scale').optional().isString(),
            body('description').optional().isString(),
            body('coordinates').optional().custom(coordinates => {
                if (typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
                    throw new Error('coordinates are not valide.');
                }
                return true;
            }),
            (req: any, res: any, next: any) => this.controller.addDocument(req, res, next)
        );

        /*
        * PATCH `/documents/:id/coordinates`
        * Updates the coordinates of a document.
        */
        this.router.patch('/:id/coordinates',
            // TODO: CHECK IF AUTH MIDDLEWARE WORKS
            //this.authenticator.isLoggedIn,
            //this.authenticator.isUserAuthorized(UserType.UrbanPlanner),
            param('id').isInt().toInt(),
            body('lat').isFloat().withMessage('Latitude must be a number'),
            body('lng').isFloat().withMessage('Longitude must be a number'),
            this.errorHandler.validateRequest,
            async (req: any, res: any, next: any) => {
                //TODO: call controller
                const {lat, lng} = req.body;
                this.controller.updateCoordinates(req.params.id, {lat, lng})
                .then(() => res.status(200).end())
                .catch((err: any) => {
                    next(err)
                })
            }
        );
    }

    /**
     * Returns the router instance.
     */
    public getRouter(): Router {
        return this.router;
    }
}

export default DocumentRoutes;