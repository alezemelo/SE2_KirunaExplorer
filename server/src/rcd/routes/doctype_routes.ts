import express, { Router } from "express";
import ErrorHandler from "./helper";
import { body, param } from "express-validator";
import { DoctypeController } from "../controllers/doctypeController";
import initRoutes from "../../routes";
import { DocumentLink, LinkType } from "../../models/document";
import Authenticator from "../../authentication/auth";
import { UserType } from "../../models/user";

class DoctypeRoutes {
    private controller: DoctypeController;
    private router: Router;
    private errorHandler: ErrorHandler;
    private authService: Authenticator;


    constructor(authenticator: Authenticator) {
        this.authService = authenticator
        this.controller = new DoctypeController();
        this.router = express.Router();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    getRouter(): Router {
        return this.router;
    };

    private initRoutes() {

        /*
        * Gets all the doctypes 
        */
        this.router.get(
            '/',
            (req: any, res: any, next: any) => this.controller.getAllDoctypes()
            .then((doctypes: string[]) =>{
                res.status(200).json(doctypes);
            })
            .catch((err: any) => {
                next(err)
            })
        )

        /*
        * Adds a new possible doctype 
        */
        this.router.post(
            '/',
            body('name').isString().withMessage("doctype name must be a string").notEmpty().withMessage("doctype name cannot be empty"),
            this.authService.isLoggedIn,
            this.authService.isUserAuthorized(UserType.UrbanPlanner), 
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.createDoctype(req.body.name)
                .then((row: any) => res.status(201).json(row).end())
                .catch((err: any) => {
                    next(err)
                })
        )

    }
}

export default DoctypeRoutes;
