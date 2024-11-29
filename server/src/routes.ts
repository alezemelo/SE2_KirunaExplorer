import express from "express"

import morgan from "morgan"
const prefix = "/kiruna_explorer"

import DocumentRoutes from "./rcd/routes/document_routes"
import ErrorHandler from "./rcd/routes/helper"
import LinkRouter from "./rcd/routes/LinksRoute"
import StakeholdersRoutes from "./rcd/routes/stakeholders_routes"
import Authenticator from "./authentication/auth"
import { AuthRoutes } from "./rcd/routes/user_routes"
import FileRoutes from "./rcd/routes/file_routes"
import path from "path"

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
    const authRoutes = new AuthRoutes(authenticator);
    const fileRoutes = new FileRoutes(authenticator);


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
    app.use(`${prefix}/files`, fileRoutes.getRouter())
    console.log("file routes initialized!");

    // Static routes
    const static_files_dir_name = 'staticfiles';
    app.use('/static', express.static(path.join(__dirname, `${static_files_dir_name}`)));
    console.log(`static routes initialized at folder ${static_files_dir_name}!`);

    ErrorHandler.registerErrorHandler(app)
    console.log("Routes were initialized!");
}

// this gets imported by index.ts
export default initRoutes