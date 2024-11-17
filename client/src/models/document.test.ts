import { Coordinates, CoordinatesAsPoint, CoordinatesAsPolygon, CoordinatesType } from './coordinates';
import { Document, DocumentLink, DocumentType, LinkType } from './document'; // Adjust the import path as necessary
import db from '../db/db';

import dayjs from 'dayjs';

describe('Document', () => {
    afterAll(() => {
        db.destroy();
    });

    describe('Document constructor', () => {
        it('should correctly create a Document instance using Point Coordinates', () => {
            const document = new Document(
                1,
                'Test Title',
                DocumentType.informative_doc,
                'test_user',
                dayjs('2023-01-01'),
                'English',
                10,
                'Stakeholder A',
                '1:1000',
                'A test document',
                new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(40.7128, -74.0060))
            );

            expect(document.id).toBe(1);
            expect(document.title).toBe('Test Title');
            expect(document.type).toBe(DocumentType.informative_doc);
            expect(document.lastModifiedBy).toBe('test_user');
            expect(document.issuanceDate?.format('YYYY-MM-DD')).toBe('2023-01-01');
            expect(document.language).toBe('English');
            expect(document.pages).toBe(10);
            expect(document.stakeholders).toBe('Stakeholder A');
            expect(document.scale).toBe('1:1000');
            expect(document.description).toBe('A test document');
            expect(document.getCoordinates()).not.toBeUndefined();
            expect(document.getCoordinates()?.toGeographyString()).toEqual("SRID=4326;POINT(40.7128 -74.006)");
        });

        it('should correctly create a Document instance using Polygon Coordinates', () => {
            const coordinates = [
                new CoordinatesAsPoint(20.123, 30.456),
                new CoordinatesAsPoint(40.789, 50.012),
                new CoordinatesAsPoint(60.345, 70.678),
                new CoordinatesAsPoint(20.123, 30.456),
            ];
            const polygon = new CoordinatesAsPolygon(coordinates);

            const document = new Document(
                1,
                'Test Title',
                DocumentType.informative_doc,
                'test_user',
                dayjs('2023-01-01'),
                'English',
                10,
                'Stakeholder A',
                '1:1000',
                'A test document',
                new Coordinates(CoordinatesType.POLYGON, polygon)
            );

            expect(document.id).toBe(1);
            expect(document.title).toBe('Test Title');
            expect(document.type).toBe(DocumentType.informative_doc);
            expect(document.lastModifiedBy).toBe('test_user');
            expect(document.issuanceDate?.format('YYYY-MM-DD')).toBe('2023-01-01');
            expect(document.language).toBe('English');
            expect(document.pages).toBe(10);
            expect(document.stakeholders).toBe('Stakeholder A');
            expect(document.scale).toBe('1:1000');
            expect(document.description).toBe('A test document');
            expect(document.getCoordinates()).not.toBeUndefined();
            expect(document.getCoordinates()?.toGeographyString()).toEqual("SRID=4326;POLYGON((20.123 30.456,40.789 50.012,60.345 70.678,20.123 30.456))");
        });

        it ('should correcly create a Document instance using Municipality Coordinates', () => {
            // Add test for municipality coordinates
            const document = new Document(
                1,
                'Test Title',
                DocumentType.informative_doc,
                'test_user',
                dayjs('2023-01-01'),
                'English',
                10,
                'Stakeholder A',
                '1:1000',
                'A test document',
                new Coordinates(CoordinatesType.MUNICIPALITY, null)
            );

            expect(document.id).toBe(1);
            expect(document.title).toBe('Test Title');
            expect(document.type).toBe(DocumentType.informative_doc);
            expect(document.lastModifiedBy).toBe('test_user');
            expect(document.issuanceDate?.format('YYYY-MM-DD')).toBe('2023-01-01');
            expect(document.language).toBe('English');
            expect(document.pages).toBe(10);
            expect(document.stakeholders).toBe('Stakeholder A');
            expect(document.scale).toBe('1:1000');
            expect(document.description).toBe('A test document');
            expect(document.getCoordinates()).not.toBeUndefined();
            expect(document.getCoordinates()?.toGeographyString()).toBeUndefined();
        });
    });

    describe('Document toObject and toObjectWithoutId methods', () => {
        it('should correctly convert a Document instance to an object with POINT coordinates', () => {
            const document = new Document(
                1,
                'Test Title',
                DocumentType.informative_doc,
                'test_user',
                dayjs('2023-01-01'),
                'English',
                10,
                'Stakeholder A',
                '1:1000',
                'A test document',
                new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(40.7128, -74.0060))
            );

            const expectedObject = {
                id: 1,
                title: 'Test Title',
                issuance_date: dayjs('2023-01-01'),
                language: 'English',
                pages: 10,
                stakeholders: 'Stakeholder A',
                scale: '1:1000',
                description: 'A test document',
                type: DocumentType.informative_doc,
                coordinates_type: CoordinatesType.POINT,
                coordinates: "SRID=4326;POINT(40.7128 -74.006)",
                last_modified_by: 'test_user',
            };

            expect(document.toObject()).toEqual(expectedObject);
        });

        it('should correctly convert a Document instance to an object with POLYGON coordinates', () => {
            const coordinates = [
                new CoordinatesAsPoint(20.123, 30.456),
                new CoordinatesAsPoint(40.789, 50.012),
                new CoordinatesAsPoint(60.345, 70.678),
                new CoordinatesAsPoint(20.123, 30.456),
            ];

            const document = new Document(
                1,
                'Test Title',
                DocumentType.informative_doc,
                'test_user',
                dayjs('2023-01-01'),
                'English',
                10,
                'Stakeholder A',
                '1:1000',
                'A test document',
                new Coordinates(CoordinatesType.POLYGON, new CoordinatesAsPolygon(coordinates))
            );

            const expectedObject = {
                id: 1,
                title: 'Test Title',
                issuance_date: dayjs('2023-01-01'),
                language: 'English',
                pages: 10,
                stakeholders: 'Stakeholder A',
                scale: '1:1000',
                description: 'A test document',
                type: DocumentType.informative_doc,
                coordinates_type: CoordinatesType.POLYGON,
                coordinates: "SRID=4326;POLYGON((20.123 30.456,40.789 50.012,60.345 70.678,20.123 30.456))",
                last_modified_by: 'test_user',
            };

            expect(document.toObject()).toEqual(expectedObject);
        });

        it('should correctly convert a Document instance to an object with MUNICIPALITY coordinates', () => {
            const document = new Document(
                1,
                'Test Title',
                DocumentType.informative_doc,
                'test_user',
                dayjs('2023-01-01'),
                'English',
                10,
                'Stakeholder A',
                '1:1000',
                'A test document',
                new Coordinates(CoordinatesType.MUNICIPALITY, null)
            );

            const expectedObject = {
                id: 1,
                title: 'Test Title',
                issuance_date: dayjs('2023-01-01'),
                language: 'English',
                pages: 10,
                stakeholders: 'Stakeholder A',
                scale: '1:1000',
                description: 'A test document',
                type: DocumentType.informative_doc,
                coordinates_type: CoordinatesType.MUNICIPALITY,
                coordinates: null,
                last_modified_by: 'test_user',
            };

            expect(document.toObject()).toEqual(expectedObject);
        });

        it('should correctly convert a Document instance to an object without the id', () => {
            const document = new Document(
                1,
                'Test Title',
                DocumentType.informative_doc,
                'test_user',
                dayjs('2023-01-01'),
                'English',
                10,
                'Stakeholder A',
                '1:1000',
                'A test document',
                new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(40.7128, -74.0060))
            );

            const expectedObject = {
                title: 'Test Title',
                issuance_date: dayjs('2023-01-01'),
                language: 'English',
                pages: 10,
                stakeholders: 'Stakeholder A',
                scale: '1:1000',
                description: 'A test document',
                type: DocumentType.informative_doc,
                coordinates_type: CoordinatesType.POINT,
                coordinates: "SRID=4326;POINT(40.7128 -74.006)",
                last_modified_by: 'test_user',
            };

            expect(document.toObjectWithoutId()).toEqual(expectedObject);
        });
    });

    describe('Document fromJSON method', () => {
        it('should correctly create a Document instance from JSON with POINT coordinates', async () => {
            const json = {
                id: 1,
                title: 'Test Title',
                type: DocumentType.informative_doc,
                last_modified_by: 'test_user',
                issuance_date: dayjs.utc('2023-01-01'),
                language: 'English',
                pages: 10,
                stakeholders: 'Stakeholder A',
                scale: '1:1000',
                description: 'A test document',
                coordinates_type: CoordinatesType.POINT,
                coordinates: "0101000020E610000000000000000034400000000000003440"
            };

            const document = await Document.fromJSON(json, db);

            expect(document.id).toBe(1);
            expect(document.title).toBe('Test Title');
            expect(document.type).toBe(DocumentType.informative_doc);
            expect(document.lastModifiedBy).toBe('test_user');
            expect(document.issuanceDate?.format('YYYY-MM-DD')).toBe('2023-01-01');
            expect(document.language).toBe('English');
            expect(document.pages).toBe(10);
            expect(document.stakeholders).toBe('Stakeholder A');
            expect(document.scale).toBe('1:1000');
            expect(document.description).toBe('A test document');

            const coordinates = document.getCoordinates();
            expect(coordinates).not.toBeUndefined();
            expect(coordinates).not.toBeNull();
            expect(coordinates?.getType()).toEqual(CoordinatesType.POINT);

            const point_coordinates = coordinates?.getCoords() as CoordinatesAsPoint;
            expect(point_coordinates.getLat()).toEqual(20);
            expect(point_coordinates.getLng()).toEqual(20);
            expect(coordinates?.toGeographyString()).toEqual("SRID=4326;POINT(20 20)");
            expect(point_coordinates.toGeographyString()).toEqual("SRID=4326;POINT(20 20)");
        });

        it("should be able to convert from null to undefined correctly", async () => {
            const json = {
                id: 1,
                title: 'Test Title',
                type: DocumentType.informative_doc,
                last_modified_by: 'test_user',
                issuance_date: null,
                language: null,
                pages: null,
                stakeholders: null,
                scale: null,
                description: null,
                coordinates_type: CoordinatesType.MUNICIPALITY,
                coordinates: null
            };

            const document = await Document.fromJSON(json, db);

            expect(document.id).toBe(1);
            expect(document.title).toBe('Test Title');
            expect(document.type).toBe(DocumentType.informative_doc);
            expect(document.lastModifiedBy).toBe('test_user');
            expect(document.issuanceDate).toBeUndefined();
            expect(document.language).toBeUndefined();
            expect(document.pages).toBeUndefined();
            expect(document.stakeholders).toBeUndefined();
            expect(document.scale).toBeUndefined();
            expect(document.description).toBeUndefined();
            
            const coordinates = document.getCoordinates();
            expect(coordinates).not.toBeUndefined();
            expect(coordinates).not.toBeNull();
            expect(coordinates?.getType()).toEqual(CoordinatesType.MUNICIPALITY);

            expect(coordinates?.getCoords()).toBeNull();
        });

        
        it('should correctly create a Document instance from JSON with POLYGON coordinates', async () => {
            const json = {
                id: 1,
                title: 'Test Title',
                type: DocumentType.informative_doc,
                last_modified_by: 'test_user',
                issuance_date: dayjs.utc('2023-01-01'),
                language: 'English',
                pages: 10,
                stakeholders: 'Stakeholder A',
                scale: '1:1000',
                description: 'A test document',
                coordinates_type: CoordinatesType.POLYGON,
                coordinates: "0103000020E61000000100000004000000736891ED7C1F3440DBF97E6ABC743E40A245B6F3FD644440A8C64B37890149405C8FC2F5282C4E4008AC1C5A64AB5140736891ED7C1F3440DBF97E6ABC743E40"
            };

            const document = await Document.fromJSON(json, db);

            expect(document.id).toBe(1);
            expect(document.title).toBe('Test Title');
            expect(document.type).toBe(DocumentType.informative_doc);
            expect(document.lastModifiedBy).toBe('test_user');
            expect(document.issuanceDate?.format('YYYY-MM-DD')).toBe('2023-01-01');
            expect(document.language).toBe('English');
            expect(document.pages).toBe(10);
            expect(document.stakeholders).toBe('Stakeholder A');
            expect(document.scale).toBe('1:1000');
            expect(document.description).toBe('A test document');

            const coordinates = document.getCoordinates();
            expect(coordinates).not.toBeUndefined();
            expect(coordinates).not.toBeNull();
            expect(coordinates?.getType()).toEqual(CoordinatesType.POLYGON);

            const point_coordinates = coordinates?.getCoords() as CoordinatesAsPolygon;
            expect(coordinates?.toGeographyString()).toEqual('SRID=4326;POLYGON((20.123 30.456,40.789 50.012,60.345 70.678,20.123 30.456))');
            expect(point_coordinates.toGeographyString()).toEqual('SRID=4326;POLYGON((20.123 30.456,40.789 50.012,60.345 70.678,20.123 30.456))');
            expect(point_coordinates.getCoordinates()[0].getLat()).toEqual(20.123);
            expect(point_coordinates.getCoordinates()[0].getLng()).toEqual(30.456);
            expect(point_coordinates.getCoordinates()[1].getLat()).toEqual(40.789);
            expect(point_coordinates.getCoordinates()[1].getLng()).toEqual(50.012);
            expect(point_coordinates.getCoordinates()[2].getLat()).toEqual(60.345);
            expect(point_coordinates.getCoordinates()[2].getLng()).toEqual(70.678);
            expect(point_coordinates.getCoordinates()[3].getLat()).toEqual(20.123);
            expect(point_coordinates.getCoordinates()[3].getLng()).toEqual(30.456);
        });

        it('should correctly create a Document instance from JSON with MUNICIPALITY coordinates', async () => {
            const json = {
                id: 1,
                title: 'Test Title',
                type: DocumentType.informative_doc,
                last_modified_by: 'test_user',
                issuance_date: dayjs.utc('2023-01-01'),
                language: 'English',
                pages: 10,
                stakeholders: 'Stakeholder A',
                scale: '1:1000',
                description: 'A test document',
                coordinates_type: CoordinatesType.MUNICIPALITY,
                coordinates: null
            };

            const document = await Document.fromJSON(json, db);

            expect(document.id).toBe(1);
            expect(document.title).toBe('Test Title');
            expect(document.type).toBe(DocumentType.informative_doc);
            expect(document.lastModifiedBy).toBe('test_user');
            expect(document.issuanceDate?.format('YYYY-MM-DD')).toBe('2023-01-01');
            expect(document.language).toBe('English');
            expect(document.pages).toBe(10);
            expect(document.stakeholders).toBe('Stakeholder A');
            expect(document.scale).toBe('1:1000');
            expect(document.description).toBe('A test document');

            const coordinates = document.getCoordinates();
            expect(coordinates).not.toBeUndefined();
            expect(coordinates).not.toBeNull();
            expect(coordinates?.getType()).toEqual(CoordinatesType.MUNICIPALITY);

            expect(coordinates?.getCoords()).toBeNull();
        });

        it('should throw an error if cooredinates_type is null-like', async () => {
            const json = {
                id: 1,
                title: 'Test Title',
                type: DocumentType.informative_doc,
                last_modified_by: 'test_user',
                issuance_date: dayjs.utc('2023-01-01'),
                language: 'English',
                pages: 10,
                stakeholders: 'Stakeholder A',
                scale: '1:1000',
                description: 'A test document',
                coordinates_type: null,
                coordinates: null
            };
              
            await expect(Document.fromJSON(json, db)).rejects.toThrow('Invalid coordinates_type: is non-nullable but found null-like value');
        });

        it('should throw an error if coordinates is null for POINT type', async () => {
            const json = {
                id: 1,
                title: 'Test Title',
                type: DocumentType.informative_doc,
                last_modified_by: 'test_user',
                issuance_date: dayjs.utc('2023-01-01'),
                language: 'English',
                pages: 10,
                stakeholders: 'Stakeholder A',
                scale: '1:1000',
                description: 'A test document',
                coordinates_type: CoordinatesType.POINT,
                coordinates: null
            };

            await expect(Document.fromJSON(json, db)).rejects.toThrow('Can\'t have null coordinates for POINT');
        });

        it('should throw an error if coordinates is null for POLYGON type', async () => {
            const json = {
                id: 1,
                title: 'Test Title',
                type: DocumentType.informative_doc,
                last_modified_by: 'test_user',
                issuance_date: dayjs.utc('2023-01-01'),
                language: 'English',
                pages: 10,
                stakeholders: 'Stakeholder A',
                scale: '1:1000',
                description: 'A test document',
                coordinates_type: CoordinatesType.POLYGON,
                coordinates: null
            };

            await expect(Document.fromJSON(json, db)).rejects.toThrow('Can\'t have null coordinates for POLYGON');
        });

        it('should throw an error if coordinates type is invalid', async () => {
            const json = {
                id: 1,
                title: 'Test Title',
                type: DocumentType.informative_doc,
                last_modified_by: 'test_user',
                issuance_date: dayjs.utc('2023-01-01'),
                language: 'English',
                pages: 10,
                stakeholders: 'Stakeholder A',
                scale: '1:1000',
                description: 'A test document',
                coordinates_type: "invalid",
                coordinates: null
            };

            await expect(Document.fromJSON(json, db)).rejects.toThrow('Invalid coordinates type');
        });
    });

    describe('Document copy method', () => {
        it('should correctly copy a Document instance', () => {
            const document = new Document(
                1,
                'Test Title',
                DocumentType.informative_doc,
                'test_user',
                dayjs('2023-01-01'),
                'English',
                10,
                'Stakeholder A',
                '1:1000',
                'A test document',
                new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(40.7128, -74.0060))
            );

            const documentCopy = document.copy();

            expect(documentCopy.id).toBe(1);
            expect(documentCopy.title).toBe('Test Title');
            expect(documentCopy.type).toBe(DocumentType.informative_doc);
            expect(documentCopy.lastModifiedBy).toBe('test_user');
            expect(documentCopy.issuanceDate?.format('YYYY-MM-DD')).toBe('2023-01-01');
            expect(documentCopy.language).toBe('English');
            expect(documentCopy.pages).toBe(10);
            expect(documentCopy.stakeholders).toBe('Stakeholder A');
            expect(documentCopy.scale).toBe('1:1000');
            expect(documentCopy.description).toBe('A test document');
            expect(documentCopy.getCoordinates()?.toGeographyString()).toEqual("SRID=4326;POINT(40.7128 -74.006)");
        });
    });

    describe('DocumentLink fromJSON method', () => {
        it('should correctly create a DocumentLink instance from JSON', () => {
            const json = {
                link_id: 1,
                doc_id1: 101,
                doc_id2: 102,
                link_type: LinkType.direct,
                created_at: '2023-01-01T00:00:00Z'
            };

            const documentLink = DocumentLink.fromJSON(json);

            expect(documentLink.linkId).toBe(1);
            expect(documentLink.docId1).toBe(101);
            expect(documentLink.docId2).toBe(102);
            expect(documentLink.linkType).toBe(LinkType.direct);
            expect(documentLink.createdAt.format('YYYY-MM-DDTHH:mm:ss[Z]')).toBe('2023-01-01T00:00:00Z');
        });

        it('should throw an error for invalid JSON types', () => {
            const invalidJson = {
                link_id: '1', // Invalid type
                doc_id1: 101,
                doc_id2: 102,
                link_type: LinkType.direct,
                created_at: '2023-01-01'
            };

            expect(() => DocumentLink.fromJSON(invalidJson)).toThrow('Invalid linkId, should be number, got 1 with type string');
        });
    });

    describe('DocumentLink toObject method', () => {
        it('should correctly convert a DocumentLink instance to an object', () => {
            const documentLink = new DocumentLink(
                1,
                101,
                102,
                LinkType.direct,
                dayjs('2023-01-01')
            );

            const expectedObject = {
                link_id: 1,
                doc_id1: 101,
                doc_id2: 102,
                link_type: LinkType.direct,
                created_at: dayjs('2023-01-01')
            };

            expect(documentLink.toObject()).toEqual(expectedObject);
        });
    });
});