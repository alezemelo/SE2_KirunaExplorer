import express from "express"

import morgan from "morgan"
const prefix = "/kiruna_explorer"

import DocumentRoutes from "./rcd/routes/document_routes"
import ErrorHandler from "./rcd/routes/helper"
import LinkRouter from "./rcd/routes/LinksRoute"
import Authenticator from "./authentication/auth"

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
    const linkDocumentRouter = new LinkRouter();
    

    /**
     * Add your routers here, like the documents router was added
     */
    

    app.use(`${prefix}/documents`, documentRoutes.getRouter())
    app.use(`${prefix}/linkDocuments`, linkDocumentRouter.getRouter());

    ErrorHandler.registerErrorHandler(app)
    console.log("Routes were initialized!");
}

// this gets imported by index.ts
export default initRoutes