const DOCUMENT_NOT_FOUND = "Document ID not found in the db";
const STAKEHOLDERS_NOT_FOUND = "Stakeholders not found in the db";
const DOCUMENT_TYPE_NOT_FOUND = "Document type not found in the db";
const SCALE_NOT_FOUND = "Scale value not found in the db";
const STAKEHOLDER_ALREADY_EXISTS = "A stakeholder with the same name is already in the db";
const INVALID_DATE = "Database got an invalid date"
const DOCUMENT_ALREADY_EXISTS = "A document with the same id is already in the db";

/**
 * Represents an error that occurs when a document is not found in the database.
 */
class DocumentNotFoundError extends Error {
    //body: string;
    customMessage: string;
    customCode: number;
    notFoundList: number[];

    constructor(notFoundList: number[]) {
        super();
        this.customMessage = DOCUMENT_NOT_FOUND;
        //this.body = DOCUMENT_NOT_FOUND;
        this.customCode = 404;
        this.notFoundList = notFoundList;
    }
}

class DocumentAlreadyExistsError extends Error {
    //body: string;
    customCode: number;
    customMessage: string;

    constructor() {
        super();
        this.customMessage = DOCUMENT_ALREADY_EXISTS;
        this.customCode = 409;
    }
}

class StakeholdersNotFoundError extends Error {
    //body: string;
    customCode: number;
    customMessage: string;

    constructor() {
        super();
        this.customMessage = STAKEHOLDERS_NOT_FOUND;
        this.customCode = 404;
        //this.customMessage = `One or more stakeholders were not found in the database.`
    }
}

class DocumentTypeNotFoundError extends Error {
    //body: string;
    customCode: number;
    customMessage: string;

    constructor() {
        super();
        this.customMessage = DOCUMENT_TYPE_NOT_FOUND;
        //this.body = DOCUMENT_TYPE_NOT_FOUND;
        this.customCode = 404;
    }
}

class InvalidDateError extends Error {
    customCode: number;
    customMessage: string;

    constructor() {
        super();
        this.customMessage = INVALID_DATE;
        this.customCode = 422;
    }
}

class ScaleNotFoundError extends Error {
    customCode: number;
    customMessage: string;

    constructor() {
        super();
        this.customMessage = SCALE_NOT_FOUND;
        this.customCode = 404;
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

export { DocumentNotFoundError, DocumentNotAddedError, StakeholdersNotFoundError, DocumentAlreadyExistsError, DocumentTypeNotFoundError, ScaleNotFoundError, InvalidDateError};