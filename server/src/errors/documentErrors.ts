const DOCUMENT_NOT_FOUND = "Document ID not found in the db";
const STAKEHOLDERS_NOT_FOUND = "Stakeholders not found in the db";
const STAKEHOLDER_ALREADY_EXISTS = "A stakeholder with the same name is already in the db";

/**
 * Represents an error that occurs when a document is not found in the database.
 */
class DocumentNotFoundError extends Error {
    body: string;
    customCode: number;
    notFoundList: number[];

    constructor(notFoundList: number[]) {
        super();
        this.body = DOCUMENT_NOT_FOUND;
        this.customCode = 404;
        this.notFoundList = notFoundList;
    }
}

class StakeholdersNotFoundError extends Error {
    body: string;
    customCode: number;
    customMessage: string;

    constructor() {
        super();
        this.body = STAKEHOLDERS_NOT_FOUND;
        this.customCode = 404;
        this.customMessage = `One or more stakehoders were not found in the database.`
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

export { DocumentNotFoundError, DocumentNotAddedError, StakeholdersNotFoundError };