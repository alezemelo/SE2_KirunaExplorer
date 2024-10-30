import express from "express"

import morgan from "morgan"
const prefix = "/kiruna_explorer"

import DocumentRoutes from "./rcd/routes/document_routes"

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

    const documentRoutes = new DocumentRoutes()

    /**
     * Add your routers here, like the documents router was added
     */

    app.use(`${prefix}/documents`, documentRoutes.getRouter())

    //ErrorHandler.registerErrorHandler(app)
    console.log("Routes were initialized!");
}

// this gets imported by index.ts
export default initRoutes