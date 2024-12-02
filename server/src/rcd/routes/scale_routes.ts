import express, { Router } from "express";
import ErrorHandler from "./helper";
import { body, param } from "express-validator";
import { ScaleController } from "../controllers/scaleController";
import initRoutes from "../../routes";
import { DocumentLink, LinkType } from "../../models/document";
import Authenticator from "../../authentication/auth";
import { UserType } from "../../models/user";

class ScaleRoutes {
    private controller: ScaleController;
    private router: Router;
    private errorHandler: ErrorHandler;
    private authService: Authenticator;


    constructor(authenticator: Authenticator) {
        this.authService = authenticator
        this.controller = new ScaleController();
        this.router = express.Router();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    getRouter(): Router {
        return this.router;
    };

    private initRoutes() {

        /*
        * Gets all the available scales 
        */
        this.router.get(
            '/',
            (req: any, res: any, next: any) => this.controller.getAllScales()
            .then((scales: string[]) =>{
                res.status(200).json(scales);
            })
            .catch((err: any) => {
                next(err)
            })
        )

        /*
        * Adds a new possible scale 
        */
        this.router.post(
            '/',
            body('value')
                .isString().withMessage("value must be a string")
                .notEmpty().withMessage("value cannot be empty")
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
            // this.authService.isLoggedIn,
            // this.authService.isUserAuthorized(UserType.UrbanPlanner),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.createScale(req.body.value)
                .then((row: any) => res.status(201).json(row).end())
                .catch((err: any) => {
                    next(err)
                })
        )

    }
}

export default ScaleRoutes;
