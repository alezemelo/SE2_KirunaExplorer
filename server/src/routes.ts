import express from "express"

import morgan from "morgan"
import LinkRouter from "./rcd/routes/LinksRoute"
const prefix = "/kiruna_explorer"

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

    const linkDocumentRouter = new LinkRouter();
    app.use(`${prefix}/linkDocuments`, linkDocumentRouter.getRouter());

    /**
     * Add your routers here, like the documents router was added
     */

    // TODO: IMPLEMENT THIS
    //app.use(`${prefix}/documents`, documentRoutes.getRouter())

    //ErrorHandler.registerErrorHandler(app)
    console.log("Routes were initialized!");
}

// this gets imported by index.ts
export default initRoutes