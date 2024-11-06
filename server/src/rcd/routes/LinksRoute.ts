import express, { Router } from "express";
import ErrorHandler from "./helper";
import { body, param } from "express-validator";
import { LinkController } from "../controllers/LinkController";
import initRoutes from "../../routes";
import { DocumentLink, LinkType } from "../../models/document";


class LinkRouter {
    private controller: LinkController;
    private router: Router;
    private errorHandler: ErrorHandler;

    constructor() {
        this.controller = new LinkController();
        this.router = express.Router();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    getRouter(): Router {
        return this.router;
    };

    private initRoutes() {

        this.router.get('/:doc_id',
            param('doc_id').isInt().toInt(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.getLinks(req.params.doc_id)
            .then((links: DocumentLink[]) =>{
                res.status(200).json(links);
            })
            .catch((err: any) => {
                if (err.message === "one of the documents does not exist" || err.message === "you can link only different documents") {
                    return res.status(400).json({ error: err.message }).end(); // Not Found
                }
                next(err)
            })
        )

        this.router.post(
            '/create',
            body('doc_id1').isInt().toInt(),
            body('doc_id2').isInt().toInt(),
            body('link_type').isIn(Object.values(LinkType)),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.createLink(req.body.doc_id1,req.body.doc_id2,req.body.link_type)   
                .then((row) => res.status(201).json(row).end())
                .catch((err: any) => {
                    if (err.message === "one of the documents does not exist") {
                        return res.status(400).json({ error: err.message }).end(); // Not Found
                    }
                    next(err)
                })
        )

    }
}

export default LinkRouter;

