import dayjs, { Dayjs } from "dayjs";

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

    issuanceDate?: Dayjs;
    language?: string;
    pages?: number;

    stakeholders?: string;
    scale?: string;
    description?: string;
    type: DocumentType;

    coordinates?: string;
    lastModifiedBy: string;

    constructor(id: number, title: string, type: DocumentType, lastModifiedBy: string,  // Required fields
                issuanceDate?: Dayjs, language?: string, pages?: number,                 // Optional fields
                stakeholders?: string, scale?: string,
                description?: string, coordinates?: string) {
        this.id = id;
        this.title = title;
        this.issuanceDate = issuanceDate;
        this.language = language;
        this.pages = pages;
        this.stakeholders = stakeholders;
        this.scale = scale;
        this.description = description;
        this.type = type;
        this.coordinates = coordinates;
        this.lastModifiedBy = lastModifiedBy;
    }

    static fromJSON(json: any): Document {
        return new Document(
            json.id,
            json.title,
            json.type,
            json.lastModifiedBy,
            json.issuanceDate ? dayjs(json.issuanceDate) : undefined,
            json.language,
            json.pages,
            json.stakeholders,
            json.scale,
            json.description,
            json.coordinates
        );
    }

    // Setters
    setIssuanceDate(issuanceDate: Dayjs) {
        this.issuanceDate = issuanceDate;
    }

    setLanguage(language: string) {
        this.language = language;
    }

    setPages(pages: number) {
        this.pages = pages;
    }

    setStakeholders(stakeholders: string) {
        this.stakeholders = stakeholders;
    }

    setScale(scale: string) {
        this.scale = scale;
    }

    setDescription(description: string) {
        this.description = description;
    }

    setCoordinates(coordinates: string) {
        this.coordinates = coordinates;
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
}

export { Document, DocumentType, DocumentLink, LinkType };

// Changelog
// Dragos 2021-10-17: Created
// Dragos 2021-11-01: Modified DocumentType and Document Link enums to those specified in the db (before they were UPPERCASE, now lowercase + _doc or sth like that)

