import { DocumentDate } from './kiruna_date'; // Replace with your actual file path
import { describe, it, expect } from '@jest/globals';

describe('DocumentDate', () => {
    describe('Constructor', () => {
        it('should create an instance from a valid ISO 8601 string', () => {
            const input = '2023-11-02T10:00:00Z';
            const date = new DocumentDate(input);
            expect(date.toISOString()).toBe(new Date(input).toISOString());
        });

        it('should create an instance from a Dayjs object', () => {
            const input = '2023-11-02';
            const dayjsInstance = DocumentDate.fromString(input).getDayjs();
            const date = new DocumentDate(dayjsInstance);
            expect(date.toFormattedString()).toBe('2023-11-02');
        });

        it('should throw an error for an invalid ISO 8601 string', () => {
            const input = 'INVALID_DATE';
            expect(() => new DocumentDate(input)).toThrow(/Invalid date format/);
        });

        it('should throw an error for an unsupported input type', () => {
            const input = 12345 as any;
            expect(() => new DocumentDate(input)).toThrow(/Invalid input type for date/);
        });
    });

    describe('Static Methods', () => {
        describe('isISO8601', () => {
            it('should return true for a valid ISO 8601 date', () => {
                const input = '2023-11-02';
                expect(DocumentDate.isISO8601(input)).toBe(true);
            });

            it('should return false for an invalid date string', () => {
                const input = 'INVALID_DATE';
                expect(DocumentDate.isISO8601(input)).toBe(false);
            });
        });

        describe('fromString', () => {
            it('should return a DocumentDate object for a valid ISO 8601 string', () => {
                const input = '2023-11-02';
                const date = DocumentDate.fromString(input);
                expect(date.toFormattedString()).toBe('2023-11-02');
            });

            it('should throw an error for an invalid ISO 8601 string', () => {
                const input = 'INVALID_DATE';
                expect(() => DocumentDate.fromString(input)).toThrow(/Invalid date string/);
            });
        });

        describe('compare', () => {
            it('should return -1 if the first date is earlier', () => {
                const date1 = new DocumentDate('2023-11-01');
                const date2 = new DocumentDate('2023-11-02');
                expect(DocumentDate.compare(date1, date2)).toBe(-1);
            });

            it('should return 1 if the first date is later', () => {
                const date1 = new DocumentDate('2023-11-03');
                const date2 = new DocumentDate('2023-11-02');
                expect(DocumentDate.compare(date1, date2)).toBe(1);
            });

            it('should return 0 if the dates are equal', () => {
                const date1 = new DocumentDate('2023-11-02');
                const date2 = new DocumentDate('2023-11-02');
                expect(DocumentDate.compare(date1, date2)).toBe(0);
            });
        });
    });

    describe('Instance Methods', () => {
        it('toISOString should return the correct ISO string', () => {
            const input = '2023-11-02T10:00:00Z';
            const date = new DocumentDate(input);
            expect(date.toISOString()).toBe(new Date(input).toISOString());
        });

        it('toFormattedString should return the date in YYYY-MM-DD format', () => {
            const input = '2023-11-02T10:00:00Z';
            const date = new DocumentDate(input);
            expect(date.toFormattedString()).toBe('2023-11-02');
        });

        it('isPast should return true for past dates', () => {
            const input = '2020-01-01';
            const date = new DocumentDate(input);
            expect(date.isPast()).toBe(true);
        });

        it('isPast should return false for future dates', () => {
            const input = '3000-01-01';
            const date = new DocumentDate(input);
            expect(date.isPast()).toBe(false);
        });

        it('isFuture should return true for future dates', () => {
            const input = '3000-01-01';
            const date = new DocumentDate(input);
            expect(date.isFuture()).toBe(true);
        });

        it('isFuture should return false for past dates', () => {
            const input = '2020-01-01';
            const date = new DocumentDate(input);
            expect(date.isFuture()).toBe(false);
        });

        it('getDayjs should return the underlying Dayjs object', () => {
            const input = '2023-11-02';
            const date = new DocumentDate(input);
            const dayjsInstance = date.getDayjs();
            expect(dayjsInstance.format('YYYY-MM-DD')).toBe(input);
        });
    });
    describe('DocumentDate Additional Tests', () => {
        describe('Constructor', () => {
            it('should handle leap years correctly', () => {
                const input = '2024-02-29'; // Valid leap year date
                const date = new DocumentDate(input);
                expect(date.toFormattedString()).toBe('2024-02-29');
            });
    
            
    
            it('should handle the minimum valid ISO date', () => {
                const input = '0001-01-01T00:00:00Z';
                const date = new DocumentDate(input);
                expect(date.toISOString()).toBe(new Date(input).toISOString());
            });
    
            it('should handle the maximum valid ISO date', () => {
                const input = '9999-12-31T23:59:59Z';
                const date = new DocumentDate(input);
                expect(date.toISOString()).toBe(new Date(input).toISOString());
            });
        });
    
        describe('Static Methods', () => {
            describe('isISO8601', () => {
                it('should return true for a valid date with milliseconds', () => {
                    const input = '2023-11-02T10:00:00.123Z';
                    expect(DocumentDate.isISO8601(input)).toBe(true);
                });
    
                it('should return true for a date with timezone offset', () => {
                    const input = '2023-11-02T10:00:00+05:30';
                    expect(DocumentDate.isISO8601(input)).toBe(true);
                });
    
                it('should return false for a date with an invalid timezone offset', () => {
                    const input = '2023-11-02T10:00:00+25:00'; // Invalid timezone
                    expect(DocumentDate.isISO8601(input)).toBe(false);
                });
            });
    
            describe('fromString', () => {
                it('should handle valid dates with timezone offsets', () => {
                    const input = '2023-11-02T10:00:00+05:30';
                    const date = DocumentDate.fromString(input);
                    expect(date.toISOString()).toBe(new Date(input).toISOString());
                });
            });
    
            describe('compare', () => {
                it('should handle dates with different timezones correctly', () => {
                    const date1 = new DocumentDate('2023-11-02T10:00:00Z');
                    const date2 = new DocumentDate('2023-11-02T15:30:00+05:30'); // Same moment in time
                    expect(DocumentDate.compare(date1, date2)).toBe(0);
                });
            });
        });
    
        describe('Instance Methods', () => {
            it('toISOString should handle timezones correctly', () => {
                const input = '2023-11-02T15:30:00+05:30';
                const date = new DocumentDate(input);
                expect(date.toISOString()).toBe(new Date(input).toISOString());
            });
    
    
            
    
            it('isFuture should handle the current date correctly', () => {
                const today = new Date().toISOString().split('T')[0];
                const date = new DocumentDate(today);
                expect(date.isFuture()).toBe(false);
            });
    
            it('should handle dates very far in the past', () => {
                const input = '1000-01-01';
                const date = new DocumentDate(input);
                expect(date.isPast()).toBe(true);
                expect(date.isFuture()).toBe(false);
            });
    
            it('should handle dates very far in the future', () => {
                const input = '9999-12-31';
                const date = new DocumentDate(input);
                expect(date.isFuture()).toBe(true);
                expect(date.isPast()).toBe(false);
            });
        });
    });    
});
