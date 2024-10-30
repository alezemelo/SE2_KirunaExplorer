const DOCUMENT_NOT_FOUND = "Document ID not found in the db";

/**
 * Represents an error that occurs when a document is not found in the database.
 */
class DocumentNotFoundError extends Error {
    customMessage: string;
    customCode: number;
    notFoundList: number[];

    constructor(notFoundList: number[]) {
        super();
        this.customMessage = DOCUMENT_NOT_FOUND;
        this.customCode = 404;
        this.notFoundList = notFoundList;
    }
}

export { DocumentNotFoundError };