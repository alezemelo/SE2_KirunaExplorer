import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import {Coordinates, CoordinatesAsPoint, CoordinatesAsPolygon, CoordinatesType} from "./coordinates";
//import { Knex } from "knex";

enum DocumentType {
    informative_doc = "informative_doc",
    prescriptive_doc = "prescriptive_doc",
    design_doc = "design_doc",
    technical_doc = "technical_doc",
    material_effect = "material_effect",
}

class Document {
    id: number;
    title: string;
    type: DocumentType;
    lastModifiedBy: string;
    connection?: string[];
    issuanceDate?: Dayjs;
    language?: string;
    pages?: number;

    stakeholders?: string;
    scale?: string;
    description?: string;
    private coordinates: Coordinates; // default to municipality type if no coordinates are provided
    

    constructor(id: number, title: string, type: DocumentType, lastModifiedBy: string,  // Required fields
                issuanceDate?: Dayjs, language?: string, pages?: number,                 // Optional fields
                stakeholders?: string, scale?: string,
                description?: string, coordinates?: Coordinates) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.lastModifiedBy = lastModifiedBy;

        this.issuanceDate = issuanceDate;
        this.language = language;
        this.pages = pages;
        this.stakeholders = stakeholders;
        this.scale = scale;
        this.description = description;

        // default to municipality type if no coordinates are provided
        this.coordinates = coordinates ? coordinates : new Coordinates(CoordinatesType.MUNICIPALITY, null);
    }

    /*
    * Use this when extracting the document from the database
    * @param json JSON object from the database
    * @param db Knex object to use for converting the coordinates (may remain unused if no coordinates or if they're municipality type)
    * @returns Document object
    * @throws Error if the JSON object is invalid
    */
    /*static async fromJSON(json: any, db: Knex): Promise<Document> {
        // Convert coordinates from WKB to Coordinates object
        if (!json.coordinates_type) {throw new Error("Invalid coordinates_type: is non-nullable but found null-like value");}           
        switch (json.coordinates_type) {
            case CoordinatesType.POINT:
                if (json.coordinates === null) {throw new Error("Can't have null coordinates for POINT");}
                const point = await CoordinatesAsPoint.fromWKBstring(json.coordinates, db);
                json.coordinates = new Coordinates(CoordinatesType.POINT, point);
                break;
            case CoordinatesType.POLYGON:
                if (json.coordinates === null) {throw new Error("Can't have null coordinates for POLYGON");}
                const polygon = await CoordinatesAsPolygon.fromWKBstring(json.coordinates, db);
                json.coordinates = new Coordinates(CoordinatesType.POLYGON, polygon);
                break;
            case CoordinatesType.MUNICIPALITY:
                json.coordinates = new Coordinates(CoordinatesType.MUNICIPALITY, null);
                break;
            default:
                throw new Error('Invalid coordinates type');
        }
        
        return new Document(
            json.id,
            json.title,
            json.type,
            json.last_modified_by,
            json.issuance_date ? dayjs.utc(json.issuance_date) : undefined,
            json.language !== null ? json.language : undefined,
            json.pages !== null ? json.pages : undefined,
            json.stakeholders !== null ? json.stakeholders : undefined,
            json.scale !== null ? json.scale : undefined,
            json.description !== null ? json.description : undefined,
            json.coordinates
        );
    }*/

    /*
    * Use this when you want to send a Document to the db
    */
    toObject(): Object {
        const my_coordinates = this.coordinates ? this.coordinates : new Coordinates(CoordinatesType.MUNICIPALITY, null);
        const my_coordinates_type = my_coordinates.getType();
        let my_coordinates_as_string = my_coordinates.getCoords()?.toGeographyString();

        return {
            id: this.id,
            title: this.title,
            issuance_date: this.issuanceDate,
            language: this.language,
            pages: this.pages,
            stakeholders: this.stakeholders,
            scale: this.scale,
            description: this.description,
            type: this.type,
            last_modified_by: this.lastModifiedBy,
            
            coordinates_type: my_coordinates_type, // not nullable
            coordinates: my_coordinates_as_string ? my_coordinates_as_string : null // db accepts strings fromatted as WKT or WKB
        };
    }

    /**
     * Use this when you want to send a Document to the db and let the autoincrement handle the primary key/ID.
     * This should return the Document's JSON without the ID.
     * 
     * Returns an object without the id field
     * @returns Object without the id field
    */
    toObjectWithoutId(): Object {
        let object_with_id: any = this.toObject();
        delete object_with_id.id;
        return object_with_id;
    }

    copy(): Document {
        return new Document(
            this.id,
            this.title,
            this.type,
            this.lastModifiedBy,
            this.issuanceDate,
            this.language,
            this.pages,
            this.stakeholders,
            this.scale,
            this.description,
            this.coordinates
        );
    }

    // ============== Getters and Setters ==============
    /* 
        * should only accept valid strings. To ensure they're valid, provide a Coordinate object and this method will convert it to a string.
    */
    setCoordinates(coordinates: Coordinates) {
        this.coordinates = coordinates;
    }

    getCoordinates(): Coordinates | undefined {
        return this.coordinates
    }
}

enum LinkType {
    direct = "direct",
    collateral = "collateral",
    projection = "projection",
    update = "update",
}

class DocumentLink {
    linkId: number;
    docId1: number;
    docId2: number;
    linkType: LinkType;
    createdAt: Dayjs;

    constructor(linkId: number, docId1: number, docId2: number, linkType: LinkType, createdAt: Dayjs) {
        this.linkId = linkId;
        this.docId1 = docId1;
        this.docId2 = docId2;
        this.linkType = linkType;
        this.createdAt = createdAt;
    }

    static fromJSON(json: any): DocumentLink {
        // check types
        if (typeof json.link_id !== 'number') throw new Error(`Invalid linkId, should be number, got ${json.link_id} with type ${typeof json.link_id}`);
        if (typeof json.doc_id1 !== 'number') throw new Error('Invalid docId1, should be number, got ${json.doc_id1} with type ${typeof json.doc_id1}');
        if (typeof json.doc_id2 !== 'number') throw new Error('Invalid docId2, should be number, got ${json.doc_id2} with type ${typeof json.doc_id2}');
        if (typeof json.link_type !== 'string') throw new Error('Invalid linkType, should be string, got ${json.link_type} with type ${typeof json.link_type}');
        if (typeof json.created_at !== 'string') throw new Error('Invalid createdAt, should be string, got ${json.created_at} with type ${typeof json.created_at}');

        return new DocumentLink(
            json.link_id,
            json.doc_id1,
            json.doc_id2,
            json.link_type,
            dayjs.utc(json.created_at)
        );
    }

    toObject(): Object {
        return {
            link_id: this.linkId,
            doc_id1: this.docId1,
            doc_id2: this.docId2,
            link_type: this.linkType,
            created_at: this.createdAt,
        };
    }

    /**
     * Use this when you want to send a DocumentLink to the db and let the autoincrement handle the primary key/ID.
     * This should return the DocumentLink's JSON without the ID.
     * 
     * Returns an object without the id field
     * @returns Object without the id field
    */
    toObjectWithoutId(): Object {
        return {
            doc_id1: this.docId1,
            doc_id2: this.docId2,
            link_type: this.linkType,
            created_at: this.createdAt,
        };
    }
}

export { Document, DocumentType, DocumentLink, LinkType };

// Changelog
// Dragos 2021-10-17: Created
// Dragos 2021-11-01: Modified DocumentType and Document Link enums to those specified in the db (before they were UPPERCASE, now lowercase + _doc or sth like that)

