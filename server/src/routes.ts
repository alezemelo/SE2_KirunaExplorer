import express from "express"

import morgan from "morgan"
const prefix = "/kiruna_explorer"

import DocumentRoutes from "./rcd/routes/document_routes"
import ErrorHandler from "./rcd/routes/helper"
import LinkRouter from "./rcd/routes/LinksRoute"
import StakeholdersRoutes from "./rcd/routes/stakeholders_routes"
import DoctypeRoutes from "./rcd/routes/doctype_routes"
import ScaleRoutes from "./rcd/routes/scale_routes"
import Authenticator from "./authentication/auth"
import { AuthRoutes } from "./rcd/routes/user_routes"

/**
 * Initializes the routes for the application.
 * 
 * @remarks
 * This function sets up the routes for the application.
 * 
 * @param {express.Application} app - The express application instance.
 */
function initRoutes(app: express.Application) {
    app.use(morgan("dev")) // Log requests to the console
    app.use(express.json({ limit: "25mb" }))
    app.use(express.urlencoded({ limit: '25mb', extended: true }))

    const authenticator = new Authenticator(app);
    const documentRoutes = new DocumentRoutes(authenticator);
    const linkDocumentRouter = new LinkRouter(authenticator);
    const stakeholdersRoutes = new StakeholdersRoutes(authenticator);
    const scaleRoutes = new ScaleRoutes(authenticator);
    const doctypeRoutes = new DoctypeRoutes(authenticator);
    const authRoutes = new AuthRoutes(authenticator);


    /**
     * Add your routers here, like the documents router was added
     */
    

    app.use(`${prefix}/documents`, documentRoutes.getRouter())
    console.log("doc routes initialized!");
    app.use(`${prefix}/linkDocuments`, linkDocumentRouter.getRouter());
    console.log("link routes initialized!");
    app.use(`${prefix}/sessions`, authRoutes.getRouter());
    console.log("auth routes initialized!");
    app.use(`${prefix}/stakeholders`, stakeholdersRoutes.getRouter())
    console.log("stakeholders routes initialized!");
    app.use(`${prefix}/doctypes`, doctypeRoutes.getRouter())
    console.log("doctypes routes initialized!");
    app.use(`${prefix}/scales`, scaleRoutes.getRouter())
    console.log("scales routes initialized!");

    ErrorHandler.registerErrorHandler(app)
    console.log("Routes were initialized!");
}

// this gets imported by index.ts
export default initRoutes