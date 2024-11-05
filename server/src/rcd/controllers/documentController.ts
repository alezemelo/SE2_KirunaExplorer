import { DocumentNotFoundError } from "../../errors/documentErrors";
import DocumentDAO from "../daos/documentDAO";
import { Document } from "../../models/document";
import { NextFunction, Request, Response } from "express";
import dayjs, { Dayjs } from "dayjs";

export interface Coordinates {
    lat: number;
    long: number;
}

/**
 * Represents a controller for handling document-related operations.
 */
class DocumentController {
    private dao: DocumentDAO;

    /**
     * Constructs a new instance of the DocumentController class.
     */
    constructor() {
        this.dao = new DocumentDAO();
    }


    /**
     * Adds a new document to the database.
     * 
     * @param title - The title of the document.
     * @param description - The description of the document.
     * @param coordinates - The coordinates of the document.
     * @param date - The date of the document.
     * @returns The ID of the newly added document.
     * @throws Error for generic errors.
     * @throws Error if the document could not be added.
     */

    public async addDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {
            title,
            type,
            lastModifiedBy,
            issuanceDate,
            language,
            pages,
            stakeholders,
            scale,
            description,
            coordinates
        } = req.body;

        // Create a document data object with the necessary fields
        const documentData = {
            title,
            type,
            lastModifiedBy,
            issuanceDate,
            language,
            pages,
            stakeholders,
            scale,
            description,
            coordinates,
        };

        try {
            // Call DAO to add the document and retrieve the generated document ID
            const documentId = await this.dao.addDocument(documentData);
            res.status(201).json({ message: 'Document added successfully', documentId });
        } catch (error) {
            console.error('Failed to add document:', error);
            next(error); // Pass the error to the error-handling middleware
        }
    };


    /**
     * Updates the description of a document. If the old description was empty, this will equate to an insertion. If the new description is empty, this will equate to a clearing.
     * 
     * @param id - The ID of the document to update.
     * @param description - The new description for the document.
     * @throws DocumentNotFoundError if the document with the specified ID is not found.
     * @throws Error if more than one document was updated or for other generic errors.
     */
    async updateDescription(id: number, description: string): Promise<void> {
        try {
            const amount_updated = await this.dao.updateDescription(id, description);
            if (amount_updated === 0) {
                throw new DocumentNotFoundError([id]);
            } 
            return;
        } catch (error) {
            console.error("Error in DocumentController - updateDescription: ", error);
            throw error;
        }
    }

    async updateCoordinates(id: number, coordinates: Coordinates): Promise<void> {
        try {
            console.log("id: ", id);
            console.log("coordinates: ", coordinates);
            const amount_updated = await this.dao.updateCoordinates(id, coordinates);
            if (amount_updated === 0) {
                throw new DocumentNotFoundError([id]);
            } 
            return;
        } catch (error) {
            console.error("Error in DocumentController - updateCoordinates: ", error);
            throw error;
        }
    }



    /**
    * Retrieves a document by its ID.
    * 
    * @param id - The ID of the document to retrieve.
    * @returns The document with the specified ID.
    * @throws DocumentNotFoundError if the document with the specified ID is not found.
    * @throws Error for generic errors.
    */
    async getDocument(id: number): Promise<Document> {
        try {
            const doc = await this.dao.getDocument(id);
            if (doc === null) {
                throw new DocumentNotFoundError([id]);
            }
            console.log(doc)
            return doc;
        } catch (error) {
            throw error;
        }
    }
}

export default DocumentController;