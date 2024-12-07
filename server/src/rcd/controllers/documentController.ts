import { DocumentAlreadyExistsError, DocumentNotFoundError, StakeholdersNotFoundError } from "../../errors/documentErrors";
import DocumentDAO from "../daos/documentDAO";
import { Document } from "../../models/document";
import { Coordinates, CoordinatesAsPoint } from "../../models/coordinates";

import { NextFunction, Request, Response } from "express";
import dayjs, { Dayjs } from "dayjs";
import StakeholdersDAO from "../daos/stakeholdersDAO";
import { UniqueConstraintError } from "../../errors/dbErrors";


/**
 * Represents a controller for handling document-related operations.
 */
class DocumentController {
    private dao: DocumentDAO;
    private stakeholdersDao: StakeholdersDAO;
    /**
     * Constructs a new instance of the DocumentController class.
     */
    constructor() {
        this.dao = new DocumentDAO();
        this.stakeholdersDao = new StakeholdersDAO();
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
            id,
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
        } = req.body;

        const documentData = new Document(
            id,
            title,
            type,
            lastModifiedBy,
            issuanceDate,
            language,
            pages,
            stakeholders,
            scale,
            description,
            Coordinates.fromJSON(coordinates) // (Dragos 2024/11/21) I need this to have the correct Coordinates methods
        );
    
        try {
            // if stakeholders were inserted check if they exist
            /*
            if (documentData.stakeholders && documentData.stakeholders.length > 0) {
                const stakeholdersExist = await this.stakeholdersDao.stakeholdersExists(documentData.stakeholders);
                if (!stakeholdersExist) {
                    throw new StakeholdersNotFoundError();
                }
            }
            */

            const documentId = await this.dao.addDocument(documentData);
            /*
            if (documentData.stakeholders && documentData.stakeholders.length > 0) {
                await this.stakeholdersDao.addStakeholdersToDocument(documentData.stakeholders, documentId);
                console.log("stakeholders added to doc")
            }
            */
            // inserts the new document
            res.status(201).json({ message: 'Document added successfully', documentId });
            
        } catch (error: any) {
            console.error('Failed to add document:', error);
            if (error instanceof Error && error.message.includes('documents_type_check')) {
                res.status(400).json({ error: 'Invalid document type' });
            //} else if (error instanceof Error && error.message.includes('foreign key constraint')) {
            //    res.status(400).json({ error: 'One or more stakeholders do not exist in the system.' });
            } else if (error instanceof Error && error.message.includes('Invalid geometry')) {
                res.status(400).json({ error: 'Invalid geometry: Ensure coordinates are valid and formatted correctly.' });
            } else if (error instanceof Error && error.message.includes('Invalid coordinates type')) {
                res.status(400).json({ error: 'Unsupported or invalid coordinates type' });
            } else {
                console.log("propagating to next...")
                next(error);
            }
        }
    }
    
    


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
            console.log(coordinates)
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
     * Calls Dao to update a document 
     * 
     * @param id - The ID of the document to update.
     * @param body - Contains fields to update
     */
    async updateDocument(id: number, body: any): Promise<void> {
        await this.dao.updateDocument(id, body);
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
            return doc;
        } catch (error) {
            throw error;
        }
    }

    async getDocuments(): Promise<Document[]> {
        try {
            const docs = await this.dao.getDocuments();
            return docs;
        } catch (error) {
            throw error;
        }
    }

    async searchDocuments(query: { search_query: string },municipality_filter?: boolean): Promise<Document[]> {
        try {
            /*const docs = await this.dao.searchDocuments(query.title);
            docs.map(doc => {
                if (doc.coordinates) {
                    const [long, lat] = doc.coordinates.replace("POINT(", "").replace(")", "").split(" ");
                    doc.coordinates = {lat: parseFloat(lat), lng: parseFloat(long)}
                }
            })
            return docs;*/
            const docs = municipality_filter ? await this.dao.searchDocuments(query.search_query,municipality_filter) : await this.dao.searchDocuments(query.search_query);
            return docs;
        } catch (error) {
            throw error;
        }
    }

    async addStakeholders(id: number, stakeholders: string[]): Promise<void> {
        try {
            const insertedRows = await this.stakeholdersDao.addStakeholdersToDocument(stakeholders, id);
            return;
        } catch (error) {
            console.error("Error in DocumentController - addStakeholders: ", error);
            throw error;
        }
    }

    async removeStakeholders(id: number, stakeholders: string[]): Promise<number> {
        try {
            const removedRows = await this.stakeholdersDao.removeStakeholdersFromDocument(stakeholders, id);
            return removedRows;
        } catch (error) {
            console.error("Error in DocumentController - removeStakeholders: ", error);
            throw error;
        }
    }
}

export default DocumentController;