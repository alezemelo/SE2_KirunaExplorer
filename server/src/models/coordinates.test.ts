import { Coordinates, CoordinatesAsPoint, CoordinatesAsPolygon, CoordinatesType } from './coordinates';
import db from '../db/db';

import { afterAll, describe, expect, it } from '@jest/globals';

describe('Coordinates, CoordinatesAsPoint, CoordinatesAsPolygon', () => {
    afterAll(async () => {
        await db.destroy();
    });
    describe('CoordinatesAsPoint', () => {
        describe('CoordinatesAsPoint Constructor and to GeographyString', () => {
            it('should create an instance with the correct latitude and longitude', () => {
                const lat = 20;
                const lng = 30;
                const coordinates = new CoordinatesAsPoint(lat, lng);

                expect(coordinates.getLat()).toBe(lat);
                expect(coordinates.getLng()).toBe(lng);
            });

            it('should return the correct geography string', () => {
                const lat = 20;
                const lng = 30;
                const coordinates = new CoordinatesAsPoint(lat, lng);
                const geographyString = coordinates.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POINT(20 30)');
            });

            it('should handle floating point numbers correctly', () => {
                const lat = 20.123;
                const lng = 30.456;
                const coordinates = new CoordinatesAsPoint(lat, lng);
                const geographyString = coordinates.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POINT(20.123 30.456)');
            });

            it('should handle negative numbers correctly', () => {
                const lat = -20.123;
                const lng = -30.456;
                const coordinates = new CoordinatesAsPoint(lat, lng);
                const geographyString = coordinates.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POINT(-20.123 -30.456)');
            });

            it('should handle positive and negative numbers correctly', () => {
                const lat = 20.123;
                const lng = -30.456;
                const coordinates = new CoordinatesAsPoint(lat, lng);
                const geographyString = coordinates.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POINT(20.123 -30.456)');
            });

            it('should handle zero correctly', () => {
                const lat = 0;
                const lng = 0;
                const coordinates = new CoordinatesAsPoint(lat, lng);
                const geographyString = coordinates.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POINT(0 0)');
            });
        });

        describe('isWKB/WKT and isPoint methods', () => {
            describe('isWKBPoint method', () => {
                it('should return true for valid WKB format', () => {
                    const wkb = '0101000020E610000000000000000034400000000000003440';
                    expect(CoordinatesAsPoint.isWKBPoint(wkb)).toBe(true);
                });

                it('should return false for invalid WKB format', () => {
                    const invalidWkb = 'INVALID_WKB';
                    expect(CoordinatesAsPoint.isWKBPoint(invalidWkb)).toBe(false);
                });

                it('should return false for a WKT', () => {
                    const wkt = 'SRID=4326;POINT(20 20)';
                    expect(CoordinatesAsPoint.isWKBPoint(wkt)).toBe(false);
                });
            });

            describe('isWKTPoint method', () => {
                it('should return true for valid WKT format', () => {
                    const wkt = 'SRID=4326;POINT(20 20)';
                    expect(CoordinatesAsPoint.isWKTPoint(wkt)).toBe(true);
                });

                it('should return false for invalid WKT format', () => {
                    const invalidWkt = 'INVALID_WKT';
                    expect(CoordinatesAsPoint.isWKTPoint(invalidWkt)).toBe(false);
                });

                it('should return true for valid WKT format with negative coordinates', () => {
                    const wkt = 'SRID=4326;POINT(-20.123 -30.456)';
                    expect(CoordinatesAsPoint.isWKTPoint(wkt)).toBe(true);
                });
            });

            
            it('isPoint should return true for valid WKB format', () => {
                const wkb = '0101000020E610000000000000000034400000000000003440';
                expect(CoordinatesAsPoint.isPoint(wkb)).toBe(true);
            });

            it('isPoint should return true for valid WKT format', () => {
                const wkt = 'SRID=4326;POINT(20 20)';
                expect(CoordinatesAsPoint.isPoint(wkt)).toBe(true);
            });

            it('isPoint should return false for invalid WKB format', () => {
                const invalidWkb = 'INVALID_WKB';
                expect(CoordinatesAsPoint.isPoint(invalidWkb)).toBe(false);
            });

            it('isPoint should return false for invalid WKT format', () => {
                const invalidWkt = 'INVALID_WKT';
                expect(CoordinatesAsPoint.isPoint(invalidWkt)).toBe(false);
            });
        });
        
        describe('wkb/wkt conversion methods', () => {
            it('should correctly convert WKB to WKT', async () => {
                const wkb = '0101000020E610000000000000000034400000000000003440';
                const wkt = await CoordinatesAsPoint.wkbToWktPoint(wkb, db);
                expect(wkt).toBe('SRID=4326;POINT(20 20)');
            });

            it('should correctly convert WKB to CoordinatesAsPoint', async () => {
                const wkb = '0101000020E610000000000000000034400000000000003440';
                const point = await CoordinatesAsPoint.fromWKBstring(wkb, db);
                expect(point.getLat()).toBe(20);
                expect(point.getLng()).toBe(20);
            });
        });
    });

    describe('CoordinatesAsPolygon', () => {
        describe('CoordinatesAsPolygon Constructor and to GeographyString', () => {
            it('should create an instance with the correct coordinates', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                    new CoordinatesAsPoint(20, 30),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);

                expect(polygon.getCoordinates()).toBe(coordinates);
            });

            it('should reject polygons with less than 4 coordinates', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                ];
                expect(() => new CoordinatesAsPolygon(coordinates)).toThrow(/Polygon must have at least 4 points/);
            });

            it('should reject polygons with non-matching first and last coordinates', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                    new CoordinatesAsPoint(80, 90),
                ];
                expect(() => new CoordinatesAsPolygon(coordinates)).toThrow(/Polygon must have the same first and last point/);
            });

            it('should create an instance with the correct coordinates even with more than 4 points', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                    new CoordinatesAsPoint(80, 90),
                    new CoordinatesAsPoint(20, 30),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);

                expect(polygon.getCoordinates()).toBe(coordinates);
            });

            it('should return the correct geography string', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                    new CoordinatesAsPoint(20, 30),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                const geographyString = polygon.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POLYGON((20 30,40 50,60 70,20 30))');
            });

            it('should handle floating point numbers correctly', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20.123, 30.456),
                    new CoordinatesAsPoint(40.789, 50.012),
                    new CoordinatesAsPoint(60.345, 70.678),
                    new CoordinatesAsPoint(20.123, 30.456),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                const geographyString = polygon.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POLYGON((20.123 30.456,40.789 50.012,60.345 70.678,20.123 30.456))');
            });

            it('should handle negative numbers correctly', () => {
                const coordinates = [
                    new CoordinatesAsPoint(-20.123, -30.456),
                    new CoordinatesAsPoint(-40.789, -50.012),
                    new CoordinatesAsPoint(-60.345, -70.678),
                    new CoordinatesAsPoint(-20.123, -30.456),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                const geographyString = polygon.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POLYGON((-20.123 -30.456,-40.789 -50.012,-60.345 -70.678,-20.123 -30.456))');
            });

            it('should handle positive and negative numbers correctly', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20.123, -30.456),
                    new CoordinatesAsPoint(-40.789, 50.012),
                    new CoordinatesAsPoint(60.345, -70.678),
                    new CoordinatesAsPoint(20.123, -30.456),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                const geographyString = polygon.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POLYGON((20.123 -30.456,-40.789 50.012,60.345 -70.678,20.123 -30.456))');
            });

            it('should handle zero correctly', () => {
                const coordinates = [
                    new CoordinatesAsPoint(0, 0),
                    new CoordinatesAsPoint(20, 20),
                    new CoordinatesAsPoint(40, 40),
                    new CoordinatesAsPoint(0, 0),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                const geographyString = polygon.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POLYGON((0 0,20 20,40 40,0 0))');
            });
        });

        describe('isWKB/WKT and isPolygon methods', () => {
            it('isWKBPolygon should return true for valid WKB format', () => {
                const wkb = '1300010004000115104145237124315264219249126106188116626416269182243253100686416819875551371736492143194245404478648172289010017181641151041452371243152642192491261061881166264';
                expect(CoordinatesAsPolygon.isWKBPolygon(wkb)).toBe(true);
            });

            it('isWKBPolygon should return false for invalid WKB format', () => {
                const invalidWkb = 'INVALID_WKB';
                expect(CoordinatesAsPolygon.isWKBPolygon(invalidWkb)).toBe(false);
            });

            it('isWKBPolygon should return false for a WKT', () => {
                const wkt = 'SRID=4326;POLYGON((20 20, 40 40, 60 60, 20 20))';
                expect(CoordinatesAsPolygon.isWKBPolygon(wkt)).toBe(false);
            });

            it('isWKTPolygon should return true for valid WKT format', () => {
                const wkt = 'SRID=4326;POLYGON((20 20, 40 40, 60 60, 20 20))';
                expect(CoordinatesAsPolygon.isWKTPolygon(wkt)).toBe(true);
            });

            it('isWKTPolygon should return true for valid WKT format without some spaces between commas', () => {
                const wkt = 'SRID=4326;POLYGON((20 20,40 40, 60 60,20 20))';
                expect(CoordinatesAsPolygon.isWKTPolygon(wkt)).toBe(true);
            });

            it('isWKTPolygon should return false for invalid WKT format', () => {
                const invalidWkt = 'INVALID_WKT';
                expect(CoordinatesAsPolygon.isWKTPolygon(invalidWkt)).toBe(false);
            });

            it('isWKTPolygon should return true for valid WKT format with negative coordinates', () => {
                const wkt = 'SRID=4326;POLYGON((-20.123 -30.456, -40.789 -50.012, -60.345 -70.678, -20.123 -30.456))';
                expect(CoordinatesAsPolygon.isWKTPolygon(wkt)).toBe(true);
            });

            it('isWKTPolygon should return false for a WKB', () => {
                const wkb = '1300010004000115104145237124315264219249126106188116626416269182243253100686416819875551371736492143194245404478648172289010017181641151041452371243152642192491261061881166264';
                expect(CoordinatesAsPolygon.isWKTPolygon(wkb)).toBe(false);
            });

            it('isWKTPolygon should return true for valid WKT format positive and negative coordinates', () => {
                const wkt = 'SRID=4326;POLYGON((20.123 -30.456, -40.789 50.012, 60.345 -70.678, 20.123 -30.456))';
                expect(CoordinatesAsPolygon.isWKTPolygon(wkt)).toBe(true);
            });

            it('isPolygon should return true for valid WKB format', () => {
                const wkb = '0103000020E61000000100000004000000736891ED7C1F3440DBF97E6ABC743E40A245B6F3FD644440A8C64B37890149405C8FC2F5282C4E4008AC1C5A64AB5140736891ED7C1F3440DBF97E6ABC743E40';
                expect(CoordinatesAsPolygon.isPolygon(wkb)).toBe(true);
            });

            it('isPolygon should return true for valid WKT format', () => {
                const wkt = 'SRID=4326;POLYGON((20 20, 40 40, 60 60, 20 20))';
                expect(CoordinatesAsPolygon.isPolygon(wkt)).toBe(true);
            });

            it('isPolygon should return false for invalid WKB format', () => {
                const invalidWkb = 'INVALID_WKB';
                expect(CoordinatesAsPolygon.isPolygon(invalidWkb)).toBe(false);
            });

            it('isPolygon should return false for invalid WKT format', () => {
                const invalidWkt = 'INVALID_WKT';
                expect(CoordinatesAsPolygon.isPolygon(invalidWkt)).toBe(false);
            });
        });

        describe('wkb/wkt conversion methods', () => {
            it('wkbToWktPolygon should correctly convert WKB to WKT', async () => {
                const wkb = '0103000020E61000000100000004000000736891ED7C1F3440DBF97E6ABC743E40A245B6F3FD644440A8C64B37890149405C8FC2F5282C4E4008AC1C5A64AB5140736891ED7C1F3440DBF97E6ABC743E40';
                const wkt = await CoordinatesAsPolygon.wkbToWktPolygon(wkb, db);
                expect(wkt).toBe('SRID=4326;POLYGON((20.123 30.456,40.789 50.012,60.345 70.678,20.123 30.456))');
            });

            it('should correctly convert WKB to CoordinatesAsPolygon', async () => {
                const wkb = '0103000020E61000000100000004000000736891ED7C1F3440DBF97E6ABC743E40A245B6F3FD644440A8C64B37890149405C8FC2F5282C4E4008AC1C5A64AB5140736891ED7C1F3440DBF97E6ABC743E40';
                const polygon = await CoordinatesAsPolygon.fromWKBstring(wkb, db);
                const coordinates = polygon.getCoordinates();
                expect(coordinates[0].getLat()).toBe(20.123);
                expect(coordinates[0].getLng()).toBe(30.456);
                expect(coordinates[1].getLat()).toBe(40.789);
                expect(coordinates[1].getLng()).toBe(50.012);
                expect(coordinates[2].getLat()).toBe(60.345);
                expect(coordinates[2].getLng()).toBe(70.678);
                expect(coordinates[3].getLat()).toBe(20.123);
                expect(coordinates[3].getLng()).toBe(30.456);
            });
        });
    });

    describe('Coordinates', () => {
        describe('Constructor', () => {
            it('should create an instance with the correct Point coordinates', () => {
                const lat = 20;
                const lng = 30;
                const coordinates = new Coordinates(CoordinatesType.POINT , new CoordinatesAsPoint(lat, lng));

                expect(coordinates.getType()).toBe(CoordinatesType.POINT);
                const point_coords = coordinates.getCoords() as CoordinatesAsPoint;
                expect(point_coords.getLat()).toBe(20);
                expect(point_coords.getLng()).toBe(30);
            });

            it('should create an instance with the correct Polygon coordinates', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                    new CoordinatesAsPoint(20, 30),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                const coords = new Coordinates(CoordinatesType.POLYGON, polygon);

                expect(coords.getType()).toBe(CoordinatesType.POLYGON);
                const polygon_coords = coords.getCoords() as CoordinatesAsPolygon;
                const polygon_coords_list = polygon_coords.getCoordinates();
                expect(polygon_coords_list[0].getLat()).toBe(20);
                expect(polygon_coords_list[0].getLng()).toBe(30);
                expect(polygon_coords_list[1].getLat()).toBe(40);
                expect(polygon_coords_list[1].getLng()).toBe(50);
                expect(polygon_coords_list[2].getLat()).toBe(60);
                expect(polygon_coords_list[2].getLng()).toBe(70);
                expect(polygon_coords_list[3].getLat()).toBe(20);
                expect(polygon_coords_list[3].getLng()).toBe(30);
            });

            it('should crete an instance when specifying MUNICIPALITY type', () => {
                const coords = new Coordinates(CoordinatesType.MUNICIPALITY, null);
                expect(coords.getType()).toBe(CoordinatesType.MUNICIPALITY);
                expect(coords.getCoords()).toBe(null);
            });

            it('should throw an error when creating an instance with a null Point', () => {
                expect(() => new Coordinates(CoordinatesType.POINT, null)).toThrow(/Invalid coordinates type for POINT/);
            });

            it('should throw an error when creating an instance with a null Polygon', () => {
                expect(() => new Coordinates(CoordinatesType.POLYGON, null)).toThrow(/Invalid coordinates type for POLYGON/);
            });

            it('should throw an error when creating an point type with a polygon object', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                    new CoordinatesAsPoint(20, 30),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                expect(() => new Coordinates(CoordinatesType.POINT, polygon)).toThrow(/Invalid coordinates type for POINT/);
            });

            it('should throw an error when creating a polygon type with a point object', () => {
                const lat = 20;
                const lng = 30;
                const point = new CoordinatesAsPoint(lat, lng);
                expect(() => new Coordinates(CoordinatesType.POLYGON, point)).toThrow(/Invalid coordinates type for POLYGON/);
            });

            it('should throw an error when creating a municipality type with a point object', () => {
                const lat = 20;
                const lng = 30;
                const point = new CoordinatesAsPoint(lat, lng);
                expect(() => new Coordinates(CoordinatesType.MUNICIPALITY, point)).toThrow(/Invalid coordinates type for MUNICIPALITY/);
            });

            it('should throw an error when creating a municipality type with a polygon object', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                    new CoordinatesAsPoint(20, 30),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                expect(() => new Coordinates(CoordinatesType.MUNICIPALITY, polygon)).toThrow(/Invalid coordinates type for MUNICIPALITY/);
            });
        });

        describe('toGeographyString', () => {
            
            it('should return a correct geography string for a Point object', () => {
                const lat = 20;
                const lng = 30;
                const point = new CoordinatesAsPoint(lat, lng);
                const coords = new Coordinates(CoordinatesType.POINT, point);
                const geographyString = coords.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POINT(20 30)');
            });

            it('should return a correct geography string for a Polygon object', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                    new CoordinatesAsPoint(20, 30),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                const coords = new Coordinates(CoordinatesType.POLYGON, polygon);
                const geographyString = coords.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POLYGON((20 30,40 50,60 70,20 30))');
            });

            it('should return undefined for a MUNICIPALITY type', () => {
                const coords = new Coordinates(CoordinatesType.MUNICIPALITY, null);
                const geographyString = coords.toGeographyString();

                expect(geographyString).toBe(undefined);
            });
        });

        describe('isGeographyString', () => {
            it('should return true for a valid Point geography string', () => {
                const geographyString = 'SRID=4326;POINT(20 30)';
                expect(Coordinates.isGeographyString(geographyString)).toBe(true);
            });

            it('should return true for a valid Polygon geography string', () => {
                const geographyString = 'SRID=4326;POLYGON((-20 30,40 -50, 60 70,-20 30))';
                expect(Coordinates.isGeographyString(geographyString)).toBe(true);
            });

            it('should return false for an invalid geography string', () => {
                const invalidGeographyString = 'INVALID_GEOGRAPHY_STRING';
                expect(Coordinates.isGeographyString(invalidGeographyString)).toBe(false);
            });
        });

        describe('fromJSON', () => {
            it('should create an instance from a JSON object with a Point', () => {
                const json = {
                    type: 'POINT',
                    coords: { lat: 20, lng: 30 },
                };
                const coords = Coordinates.fromJSON(json);
                expect(coords.getType()).toBe(CoordinatesType.POINT);
                const point = coords.getCoords() as CoordinatesAsPoint;
                expect(point.getLat()).toBe(20);
                expect(point.getLng()).toBe(30);
            });

            it('should create an instance from a JSON object with a Polygon', () => {
                const json = {
                    type: 'POLYGON',
                    coords: { coordinates: [
                            { lat: 20, lng: 30 },
                            { lat: 40, lng: 50 },
                            { lat: 60, lng: 70 },
                            { lat: 20, lng: 30 },
                        ]
                    },
                };
                const coords = Coordinates.fromJSON(json);
                expect(coords.getType()).toBe(CoordinatesType.POLYGON);
                const polygon = coords.getCoords() as CoordinatesAsPolygon;
                const polygon_coords = polygon.getCoordinates();
                expect(polygon_coords[0].getLat()).toBe(20);
                expect(polygon_coords[0].getLng()).toBe(30);
                expect(polygon_coords[1].getLat()).toBe(40);
                expect(polygon_coords[1].getLng()).toBe(50);
                expect(polygon_coords[2].getLat()).toBe(60);
                expect(polygon_coords[2].getLng()).toBe(70);
                expect(polygon_coords[3].getLat()).toBe(20);
                expect(polygon_coords[3].getLng()).toBe(30);
            });

            it('should create an instance from a JSON object with a MUNICIPALITY type', () => {
                const json = {
                    type: 'MUNICIPALITY',
                };
                const coords = Coordinates.fromJSON(json);
                expect(coords.getType()).toBe(CoordinatesType.MUNICIPALITY);
                expect(coords.getCoords()).toBe(null);
            });

            it('should throw an error for an invalid type', () => {
                const json = {
                    type: 'INVALID_TYPE',
                };
                expect(() => Coordinates.fromJSON(json)).toThrow(/Invalid coordinates JSON/);
            });

            it('should throw an error for a missing type', () => {
                const json = {
                    coords: { lat: 20, lng: 30 },
                };
                expect(() => Coordinates.fromJSON(json)).toThrow(/Invalid coordinates JSON/);
            });

            it('should throw an error for a missing coords with POINT', () => {
                const json = {
                    type: 'POINT',
                };
                expect(() => Coordinates.fromJSON(json)).toThrow(/Invalid coordinates JSON/);
            });

            it('should throw an error for a missing coords with POLYGON', () => {
                const json = {
                    type: 'POLYGON',
                };
                expect(() => Coordinates.fromJSON(json)).toThrow(/Invalid coordinates JSON/);
            });

            it('should throw an error for an invalid coords with POINT', () => {
                const json = {
                    type: 'POINT',
                    coords: 'INVALID_COORDS',
                };
                expect(() => Coordinates.fromJSON(json)).toThrow(/Invalid POINT coordinates/);
            });

            it('should throw an error for an invalid coords with POLYGON #1', () => {
                const json = {
                    type: 'POLYGON',
                    coords: 'INVALID_COORDS',
                };
                expect(() => Coordinates.fromJSON(json)).toThrow(/Invalid POLYGON coordinates/);
            });
        });
    });

    describe('CoordinatesAsPolygon', () => {
        describe('Constructor and to GeographyString', () => {
            it('should create an instance with the correct coordinates', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                    new CoordinatesAsPoint(20, 30),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);

                expect(polygon.getCoordinates()).toBe(coordinates);
            });

            it('should reject polygons with less than 4 coordinates', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                ];
                expect(() => new CoordinatesAsPolygon(coordinates)).toThrow(/Polygon must have at least 4 points/);
            });

            it('should reject polygons with non-matching first and last coordinates', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                    new CoordinatesAsPoint(80, 90),
                ];
                expect(() => new CoordinatesAsPolygon(coordinates)).toThrow(/Polygon must have the same first and last point/);
            });

            it('should create an instance with the correct coordinates even with more than 4 points', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                    new CoordinatesAsPoint(80, 90),
                    new CoordinatesAsPoint(20, 30),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);

                expect(polygon.getCoordinates()).toBe(coordinates);
            });

            it('should return the correct geography string', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                    new CoordinatesAsPoint(20, 30),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                const geographyString = polygon.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POLYGON((20 30,40 50,60 70,20 30))');
            });

            it('should handle floating point numbers correctly', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20.123, 30.456),
                    new CoordinatesAsPoint(40.789, 50.012),
                    new CoordinatesAsPoint(60.345, 70.678),
                    new CoordinatesAsPoint(20.123, 30.456),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                const geographyString = polygon.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POLYGON((20.123 30.456,40.789 50.012,60.345 70.678,20.123 30.456))');
            });

            it('should handle negative numbers correctly', () => {
                const coordinates = [
                    new CoordinatesAsPoint(-20.123, -30.456),
                    new CoordinatesAsPoint(-40.789, -50.012),
                    new CoordinatesAsPoint(-60.345, -70.678),
                    new CoordinatesAsPoint(-20.123, -30.456),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                const geographyString = polygon.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POLYGON((-20.123 -30.456,-40.789 -50.012,-60.345 -70.678,-20.123 -30.456))');
            });

            it('should handle positive and negative numbers correctly', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20.123, -30.456),
                    new CoordinatesAsPoint(-40.789, 50.012),
                    new CoordinatesAsPoint(60.345, -70.678),
                    new CoordinatesAsPoint(20.123, -30.456),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                const geographyString = polygon.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POLYGON((20.123 -30.456,-40.789 50.012,60.345 -70.678,20.123 -30.456))');
            });

            it('should handle zero correctly', () => {
                const coordinates = [
                    new CoordinatesAsPoint(0, 0),
                    new CoordinatesAsPoint(20, 20),
                    new CoordinatesAsPoint(40, 40),
                    new CoordinatesAsPoint(0, 0),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                const geographyString = polygon.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POLYGON((0 0,20 20,40 40,0 0))');
            });

            it('should handle whole municipality correctly', () => {
                const coordinates = [
                    new CoordinatesAsPoint(20, 30),
                    new CoordinatesAsPoint(40, 50),
                    new CoordinatesAsPoint(60, 70),
                    new CoordinatesAsPoint(20, 30),
                ];
                const polygon = new CoordinatesAsPolygon(coordinates);
                const geographyString = polygon.toGeographyString();

                expect(geographyString).toBe('SRID=4326;POLYGON((20 30,40 50,60 70,20 30))');
            });
        }
    );
});

});
