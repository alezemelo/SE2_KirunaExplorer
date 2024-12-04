import express, { Router, Request, Response, NextFunction } from "express";
import ErrorHandler from "./helper";
import { body, param,validationResult, query } from "express-validator";
import Authenticator from "../../authentication/auth";
import { UserType } from "../../models/user";

import { DocumentNotFoundError } from "../../errors/documentErrors";
import DocumentController from "../controllers/documentController";
import { Coordinates, CoordinatesAsPoint, CoordinatesAsPolygon, CoordinatesType } from "../../models/coordinates";

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
    private authService: Authenticator;

    /**
     * Constructs a new instance of the DocumentRoutes class.
     */
    constructor(authenticator: Authenticator) {
        this.authService= authenticator;
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
         * [route names: update description, add description]
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
            param('id').isInt().toInt(),
            body('description').isString().isLength({ max: 2500 }),
            this.authService.isLoggedIn,
            this.authService.isUserAuthorized(UserType.UrbanPlanner),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.updateDescription(req.params.id, req.body.description)   
                .then(() => res.status(200).end())
                .catch((err: any) => {
                    next(err)
                })
        );


        /*
        * [route names: search documents, get documents by title, get document by title]
        * GET /documents/search
        * API for searching a doc with a specific title
        * performs case insensitive search
        * PLEASE NOTE: DO NOT move this below the GET /documents/:id route,
        * otherwise the "search" in the url will be matched by the GET /documents/:id route
        * thanks <3
        */
        this.router.get(
            '/search',
            query('title').isString().withMessage("title must be a string").notEmpty().withMessage("title is required"),
            query('municipality_filter').optional().isIn(['true', 'false']).withMessage('municipality_filter must be either "true" or "false"'),
            //this.authService.isLoggedIn,
            //this.authService.isUserAuthorized(UserType.UrbanPlanner),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                try {
                    (req.query.municipality_filter ? this.controller.searchDocuments(req.query,req.query.municipality_filter) : this.controller.searchDocuments(req.query))
                        .then((documents: any) => {
                            res.status(200).json(documents)})
                        .catch((err: any) => {
                            console.log("an error while searching for documents!", err);
                            next(err)
                        });
                } catch (error) {
                    console.error("Unexpected error in /search route:", error);
                    res.status(500).json({ error: "Internal server error" });
                }
            }
        );

        /* 
        * [route names: get document by id]
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
            param('id').isInt().withMessage("id must be an integer").toInt(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.getDocument(req.params.id)
                .then((document: any) => res.status(200).json(document))
                .catch((err: any) => {
                    next(err)
                })
        )

        /*
        * [route names: get documents, get all documents]
        * GET /documents
        * Retrieves all documents.
        * 
        * Response:
        * - 200 OK: If the documents were successfully retrieved.
        */
        this.router.get(
            `/`,
            (req: any, res: any, next: any) => this.controller.getDocuments()
                .then((documents: any) => {res.status(200).json(documents)
                })
                .catch((err: any) => {
                    next(err)
                })
        )

        /*
        * [route names: add document, create document, create new document, add new document, make document]
        * POST /documents
        * Adds a new document.
        * 
        */
        this.router.post(
            '/',
            body('title')
                .isString()
                .withMessage('Title must be a string')
                .notEmpty()
                .withMessage('Title is required'),
            body('type')
                .isString()
                .withMessage('Type must be a string')
                .notEmpty()
                .withMessage('Type is required'),
                //.isIn(["informative_doc", "prescriptive_doc", "design_doc", "technical_doc", "material_effect"])
                //.withMessage("Type of doc must be either: 'informative_doc',  'prescriptive_doc', 'design_doc', 'technical_doc', 'material_effect"),
            body('lastModifiedBy')
                .isString()
                .withMessage('Last modified by must be a string')
                .notEmpty()
                .withMessage('Last modified by is required'),
            body('issuanceDate')
                .optional()
                .isISO8601()
                .withMessage('Issuance date must be a valid ISO8601 date'),
            body('language')
                .optional()
                .isString()
                .withMessage('Language must be a string'),
            body('pages')
                .optional()
                .isInt()
                .withMessage('Pages must be an integer'),
            /*
            body('stakeholders')
                .optional()
                .isString()
                .withMessage('Stakeholders must be a string')
                .customSanitizer((value) => value.replace(/s*, \s*\/g, ',')) 
                .matches(/^(|w+)(,\w+)*$/).withMessage("Must be a single word or comma-separated list of words"),
            */
            body('stakeholders').isArray().withMessage('Stakeholders must be an array')
            .custom((stakeholders) => {
                if (!stakeholders.every((stakeholder: any) => typeof stakeholder === 'string' && stakeholder.trim() !== '')) {
                    throw new Error('Each stakeholder must be a non-empty string');
                }
                return true;
            }),
            body('scale')
                .optional()
                .isString()
                .withMessage('Scale must be a string'),
            body('description')
                .optional()
                .isString()
                .withMessage('Description must be a string'),
            body('coordinates')
                .optional()
                .custom((coordinates) => {
                    if (!coordinates.type) {
                        throw new Error('Coordinates type is required');
                    }
                    if (coordinates.type === 'POINT') {
                        if (
                            !coordinates.coords ||
                            typeof coordinates.coords.lat !== 'number' ||
                            typeof coordinates.coords.lng !== 'number'
                        ) {
                            throw new Error('Invalid POINT coordinates: lat and lng must be numbers');
                        }
                    } else if (coordinates.type !== 'MUNICIPALITY') {
                        throw new Error('Invalid coordinates type');
                    }
                    return true;
                }),
            this.authService.isLoggedIn,
            this.authService.isUserAuthorized(UserType.UrbanPlanner),
            async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                // Handle validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    console.log('Validation Errors:', errors.array());
                    res.status(400).json({ errors: errors.array() });
                    return;
                }
        
                // Call controller to process the request
                try {
                    await this.controller.addDocument(req, res, next);
                } catch (error) {
                    console.error('Unexpected Error:', error);
                    // Check if it's a database error
                    if ((error as any).code === 'XX000') {
                        res.status(400).json({
                            error: 'Invalid geometry: Ensure coordinates are valid and formatted correctly.',
                        });
                    }
                    /*
                    else {
                        res.status(500).json({
                            error: 'Internal Server Error',
                        });
                    }
                    */
                    next(error);
                }
            }
        );
        

        /*
        * [route names: update coordinates, update coords]
        *
        * PATCH `/documents/:id/coordinates`
        * Updates the coordinates of a document.
        */
        this.router.patch('/:id/coordinates',
            this.authService.isLoggedIn,
            this.authService.isUserAuthorized(UserType.UrbanPlanner),
            param('id').isInt().toInt(),
            body('type').isIn([CoordinatesType.POINT, CoordinatesType.POLYGON, CoordinatesType.MUNICIPALITY]).withMessage('Invalid coordinates type'),
            body('coords').custom((value, { req }) => {
                if (req.body.type !== CoordinatesType.MUNICIPALITY) {
                    if (!value || typeof value.lat !== 'number' || typeof value.lng !== 'number') {
                        throw new Error('Invalid coordinates');
                    }
                }
                return true;
            }),
            this.errorHandler.validateRequest,
            async (req: any, res: any, next: any) => {
                //TODO: call controller
                let {type, coords} = req.body;
                if (type === CoordinatesType.MUNICIPALITY) {
                    coords = null;
                } else if (type === CoordinatesType.POINT) {
                    coords = new CoordinatesAsPoint(coords.lat, coords.lng);
                } else if (type === CoordinatesType.POLYGON) {
                    coords = new CoordinatesAsPolygon(coords);
                }
                this.controller.updateCoordinates(req.params.id, new Coordinates(type,coords))
                .then(() => res.status(200).end())
                .catch((err: any) => {
                    next(err)
                })
            }
        );
    

    /*
        Adds stakeholders to a document
    */
    this.router.post('/:id/stakeholders', 
        this.authService.isLoggedIn,
        this.authService.isUserAuthorized(UserType.UrbanPlanner),
        param('id').isInt().toInt(),
        body('stakeholders').isArray({min: 1}).withMessage('Stakeholders must be a non empty array')
        .custom((stakeholders) => {
            if (!stakeholders.every((stakeholder: any) => typeof stakeholder === 'string' && stakeholder.trim() !== '')) {
                throw new Error('Each stakeholder must be a non-empty string');
            }
            return true;
        }),
        this.errorHandler.validateRequest,
        async (req: any, res: any, next: any) => {
            this.controller.addStakeholders(req.params.id, req.body.stakeholders)
            .then(() => res.status(200).end())
            .catch((err: any) => {
                next(err)
            })
        }
    );

    this.router.delete('/:id/stakeholders', 
        this.authService.isLoggedIn,
        this.authService.isUserAuthorized(UserType.UrbanPlanner),
        param('id').isInt().toInt(),
        body('stakeholders').isArray({min: 1}).withMessage('Stakeholders must be a non empty array')
        .custom((stakeholders) => {
            if (!stakeholders.every((stakeholder: any) => typeof stakeholder === 'string' && stakeholder.trim() !== '')) {
                throw new Error('Each stakeholder must be a non-empty string');
            }
            return true;
        }),
        this.errorHandler.validateRequest,
        async (req: any, res: any, next: any) => {
            this.controller.removeStakeholders(req.params.id, req.body.stakeholders)
            .then((deletedRows) => res.status(200).json({deletedRows}))
            .catch((err: any) => {
                next(err)
            })
        }
    );


    this.router.patch('/:id',
        this.authService.isLoggedIn,
        this.authService.isUserAuthorized(UserType.UrbanPlanner),
        param('id').isInt().toInt(),
        body('doctype').optional().isString().withMessage('Doctype must be a string').notEmpty().withMessage('Doctype must not be empty'),
        body('scale').optional().isString().withMessage('Scale must be a string').notEmpty().withMessage('Scale must not be empty')
            // standardizes
            .customSanitizer((value) => {
                const lowerValue = value.toLowerCase();
                if (lowerValue === 'text') return 'Text';
                if (lowerValue === 'blueprint/effects') return 'blueprint/effects';
                return value; // Return unmodified if not matching the cases
            })
            .customSanitizer((value) => {
                return value.replace(/:([\d.]+)/, (_: any, num: any) => `:${num.replace(/\./g, '')}`);
            })
        // checks that the format is 1:some_positive_integer
        .matches(/^(1:\d+|Text|blueprint\/effects)$/).withMessage('Value must follow the format "1:number", where number is a positive integer or be "Text" or "blueprint/effects"'),
        body('stakeholders').optional().isArray().withMessage('Stakeholders must be an array')
        .custom((stakeholders) => {
            if (!stakeholders.every((stakeholder: any) => typeof stakeholder === 'string' && stakeholder.trim() !== '')) {
                throw new Error('Each stakeholder must be a non-empty string');
            }
            return true;
        }),
        body('issuanceDate').optional().isISO8601().withMessage('Issuance date must be a valid ISO8601 date'),
        this.errorHandler.validateRequest,
        async (req: any, res: any, next: any) => {
            this.controller.updateDocument(req.params.id, req.body)
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