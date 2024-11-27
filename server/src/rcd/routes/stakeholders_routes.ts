import express, { Router } from "express";
import ErrorHandler from "./helper";
import { body, param } from "express-validator";
import { StakeholdersController } from "../controllers/stakeholdersController";
import initRoutes from "../../routes";
import { DocumentLink, LinkType } from "../../models/document";
import Authenticator from "../../authentication/auth";
import { UserType } from "../../models/user";

class StakeholdersRoutes {
    private controller: StakeholdersController;
    private router: Router;
    private errorHandler: ErrorHandler;
    private authService: Authenticator;


    constructor(authenticator: Authenticator) {
        this.authService = authenticator
        this.controller = new StakeholdersController();
        this.router = express.Router();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    getRouter(): Router {
        return this.router;
    };

    private initRoutes() {

        /*
        * Gets all the stakeholders
        */
        this.router.get(
            '/',
            (req: any, res: any, next: any) => this.controller.getAllStakeholders()
            .then((stakeholders: string[]) =>{
                res.status(200).json(stakeholders);
            })
            .catch((err: any) => {
                next(err)
            })
        )

        /*
        * Adds a new possible stakeholder
        */
        this.router.post(
            '/',
            body('name').isString().withMessage("stakeholders name must be a string").notEmpty().withMessage("stakeholders name cannot be empty"),
            this.authService.isLoggedIn,
            this.authService.isUserAuthorized(UserType.UrbanPlanner), 
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.createStakeholder(req.body.name)
                .then((row: any) => res.status(201).json(row).end())
                .catch((err: any) => {
                    next(err)
                })
        )

    }
}

export default StakeholdersRoutes;
