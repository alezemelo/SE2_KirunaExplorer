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

    private initRoutes() {

        this.router.get('/:doc_id',
            param('doc_id').isInt().toInt(),
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => this.controller.getLinks(req.params.doc_id)
            .then((links: DocumentLink[]) => res.status(200).json(links))
            .catch((err: any) => {
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
                .then(() => res.status(201).end())
                .catch((err: any) => {
                    next(err)
                })
        )

    }
}

export default LinkRouter;

