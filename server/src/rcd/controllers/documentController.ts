import { DocumentNotFoundError } from "../../errors/documentErrors";
import DocumentDAO from "../daos/documentDAO";
import { Document } from "../../models/document";

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
     * Updates the description of a document. If the old description was empty, this will equate to an insertion. If the new description is empty, this will equate to a clearing.
     * 
     * @param id - The ID of the document to update.
     * @param description - The new description for the document.
     * @throws DocumentNotFoundError if the document with the specified ID is not found.
     * @throws Error if more than one document was updated or for other generic errors.
     */
    async updateDescription(id: number, description: string): Promise<void> {
        try {
            console.log("id: ", id);
            console.log("description: ", description);

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