import db from '../db/db';
import { Coordinates } from './coordinates';

describe('Coordinates', () => {
    describe('Coordinates Constructor and to GeographyString', () => {
        it('should create an instance with the correct latitude and longitude', () => {
            const lat = 20;
            const lng = 30;
            const coordinates = new Coordinates(lat, lng);

            expect(coordinates.lat).toBe(lat);
            expect(coordinates.lng).toBe(lng);
        });

        it('should return the correct geography string', () => {
            const lat = 20;
            const lng = 30;
            const coordinates = new Coordinates(lat, lng);
            const geographyString = coordinates.toGeographyString();

            expect(geographyString).toBe('SRID=4326;POINT(20 30)');
        });

        it('should handle floating point numbers correctly', () => {
            const lat = 20.123;
            const lng = 30.456;
            const coordinates = new Coordinates(lat, lng);
            const geographyString = coordinates.toGeographyString();

            expect(geographyString).toBe('SRID=4326;POINT(20.123 30.456)');
        });

        it('should handle negative numbers correctly', () => {
            const lat = -20.123;
            const lng = -30.456;
            const coordinates = new Coordinates(lat, lng);
            const geographyString = coordinates.toGeographyString();

            expect(geographyString).toBe('SRID=4326;POINT(-20.123 -30.456)');
        });

        it('should handle positive and negative numbers correctly', () => {
            const lat = 20.123;
            const lng = -30.456;
            const coordinates = new Coordinates(lat, lng);
            const geographyString = coordinates.toGeographyString();

            expect(geographyString).toBe('SRID=4326;POINT(20.123 -30.456)');
        });

        it('should handle zero correctly', () => {
            const lat = 0;
            const lng = 0;
            const coordinates = new Coordinates(lat, lng);
            const geographyString = coordinates.toGeographyString();

            expect(geographyString).toBe('SRID=4326;POINT(0 0)');
        });
    });

    describe('WKB and WKT methods', () => {
        afterAll(async () => {
            await db.destroy();
        });

        describe('isWKB method', () => {
            it('should return true for valid WKB format', () => {
                const wkb = '0101000020E610000000000000000034400000000000003440';
                expect(Coordinates.isWKB(wkb)).toBe(true);
            });

            it('should return false for invalid WKB format', () => {
                const invalidWkb = 'INVALID_WKB';
                expect(Coordinates.isWKB(invalidWkb)).toBe(false);
            });

            it('should return false for a WKT', () => {
                const wkt = 'SRID=4326;POINT(20 20)';
                expect(Coordinates.isWKB(wkt)).toBe(false);
            });
        });

        describe('isWKT method', () => {
            it('should return true for valid WKT format', () => {
                const wkt = 'SRID=4326;POINT(20 20)';
                expect(Coordinates.isWKTPoint(wkt)).toBe(true);
            });

            it('should return false for invalid WKT format', () => {
                const invalidWkt = 'INVALID_WKT';
                expect(Coordinates.isWKTPoint(invalidWkt)).toBe(false);
            });

            it('should return true for valid WKT format with negative coordinates', () => {
                const wkt = 'SRID=4326;POINT(-20.123 -30.456)';
                expect(Coordinates.isWKTPoint(wkt)).toBe(true);
            });
        });

        describe('wkbToWkt method', () => {
            it('should correctly convert WKB to WKT', async () => {
                const wkb = '0101000020E610000000000000000034400000000000003440';
                const wkt = await Coordinates.wkbToWktPoint(wkb, db);
                expect(wkt).toBe('SRID=4326;POINT(20 20)');
            });
        });
    });
});