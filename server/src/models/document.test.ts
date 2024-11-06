import { Document, DocumentLink, DocumentType, LinkType } from './document'; // Adjust the import path as necessary
import dayjs from 'dayjs';

describe('Document toObject method', () => {
    it('should correctly convert a Document instance to an object', () => {
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
            { lat: 40.7128, lng: -74.0060 }
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
            coordinates: { lat: 40.7128, lng: -74.0060 },
            last_modified_by: 'test_user',
        };

        expect(document.toObject()).toEqual(expectedObject);
    });
});

describe('Document fromJSON method', () => {
    it('should correctly create a Document instance from JSON', () => {
        const json = {
            id: 1,
            title: 'Test Title',
            type: DocumentType.informative_doc,
            last_modified_by: 'test_user',
            issuance_date: '2023-01-01',
            language: 'English',
            pages: 10,
            stakeholders: 'Stakeholder A',
            scale: '1:1000',
            description: 'A test document',
            coordinates: { lat: 40.7128, lng: -74.0060 }
        };

        const document = Document.fromJSON(json);

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
        expect(document.coordinates).toEqual({ lat: 40.7128, lng: -74.0060 });
    });

    it("should be able to convert from null to undefined correctly", () => {
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
            coordinates: null
        };

        const document = Document.fromJSON(json);

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
        expect(document.coordinates).toBeUndefined();
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