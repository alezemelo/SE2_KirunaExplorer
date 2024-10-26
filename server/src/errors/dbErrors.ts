const FOREIGN_KEY_VIOLATION = "Foreign key constraint violation: One or more foreign keys do not exist.";
const UNIQUE_CONSTRAINT_VIOLATION = "Unique constraint violation: A record with the same unique key already exists.";

/**
 * Represents an error that occurs when there is a foreign key constraint violation.
 */
class ForeignKeyConstraintError extends Error {
    customMessage: string;
    customCode: number;

    constructor() {
        super();
        this.customMessage = FOREIGN_KEY_VIOLATION;
        this.customCode = 400;
    }
}

/**
 * Represents an error that occurs when there is a unique constraint violation.
 */
class UniqueConstraintError extends Error {
    customMessage: string;
    customCode: number;

    constructor() {
        super();
        this.customMessage = UNIQUE_CONSTRAINT_VIOLATION;
        this.customCode = 409;
    }
}

export { ForeignKeyConstraintError, UniqueConstraintError };