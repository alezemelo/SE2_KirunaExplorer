import dayjs, { Dayjs } from 'dayjs';

export class DocumentDate {
    private date: Dayjs;

    /**
     * Constructor to create a `DocumentDate` object.
     *
     * @param input - The input date string or Dayjs object.
     */
    constructor(input: string | Dayjs) {
        if (typeof input === 'string') {
            const parsedDate = dayjs(input, undefined, true);
            if (!parsedDate.isValid()) {
                throw new Error("Invalid date format. Expected ISO 8601 format.");
            }
            this.date = parsedDate;
        } else if (input instanceof dayjs) {
            this.date = input;
        } else {
            throw new Error("Invalid input type for date. Expected string or Dayjs object.");
        }
    }

    /**
     * Returns the date as an ISO 8601 string.
     *
     * @returns The ISO 8601 string representation of the date.
     */
    toISOString(): string {
        return this.date.toISOString();
    }

    /**
     * Returns the date in a human-readable format (e.g., YYYY-MM-DD).
     *
     * @returns The formatted date string.
     */
    toFormattedString(): string {
        return this.date.format('YYYY-MM-DD');
    }

    /**
     * Checks if the date is in the past.
     *
     * @returns `true` if the date is in the past, otherwise `false`.
     */
    isPast(): boolean {
        return this.date.isBefore(dayjs());
    }

    /**
     * Checks if the date is in the future.
     *
     * @returns `true` if the date is in the future, otherwise `false`.
     */
    isFuture(): boolean {
        return this.date.isAfter(dayjs());
    }

    /**
     * Returns the underlying Dayjs object for advanced manipulation.
     *
     * @returns The Dayjs object representing the date.
     */
    getDayjs(): Dayjs {
        return this.date;
    }

    // ============== Static Methods ==============

    /**
     * Checks if a given string is a valid ISO 8601 date.
     *
     * @param input - The input date string.
     * @returns `true` if valid, otherwise `false`.
     */
    static isISO8601(input: string): boolean {
        return dayjs(input, undefined, true).isValid();
    }

    /**
     * Parses a date string and returns a `DocumentDate` object.
     *
     * @param input - The input date string.
     * @returns A `DocumentDate` object if valid.
     * @throws Error if the input is invalid.
     */
    static fromString(input: string): DocumentDate {
        if (!this.isISO8601(input)) {
            throw new Error("Invalid date string. Expected ISO 8601 format.");
        }
        return new DocumentDate(input);
    }

    /**
     * Compares two dates to determine their order.
     *
     * @param date1 - The first date to compare.
     * @param date2 - The second date to compare.
     * @returns `-1` if date1 is before date2, `1` if date1 is after date2, or `0` if equal.
     */
    static compare(date1: DocumentDate, date2: DocumentDate): number {
        if (date1.date.isBefore(date2.date)) {
            return -1;
        } else if (date1.date.isAfter(date2.date)) {
            return 1;
        }
        return 0;
    }
}
