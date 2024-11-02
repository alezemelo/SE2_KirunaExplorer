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

/**
 * Represents an error when a document is not added to the database.
 */
class DocumentNotAddedError extends Error {
    customMessage: string;
    customCode: number;

    constructor() {
        super();
        this.customMessage = "Document not added to the database";
        this.customCode = 500;
    }
}

export { DocumentNotFoundError, DocumentNotAddedError };