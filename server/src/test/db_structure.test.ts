import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import db from "../db/db";
import {Document, DocumentType} from "../models/document";
import { dbEmpty } from "../db/db_common_operations";
import { Coordinates } from "../models/coordinates";
import KirunaDate from "../models/kiruna_date";

const complete_doc = new Document(
    15, // ID
    "Compilation of responses “So what the people of Kiruna think?” (15)", // Title
    DocumentType.informative_doc, // Type
    "admin", // Last modified by
  
    dayjs.utc("2005"), // Issuance date
    "Swedish", // Language
    999, // Pages
    "Kiruna kommun/Residents", // Stakeholders
    "Text", // Scale
    `This document is a compilation of the responses to ` +
        `the survey 'What is your impression of Kiruna?' ` +
        `From the citizens' responses to this last part of the ` +
        `survey, it is evident that certain buildings, such as ` +
        `the Kiruna Church, the Hjalmar Lundbohmsgården, ` +
        `and the Town Hall, are considered of significant ` +
        `value to the population. The municipality views the ` +
        `experience of this survey positively, to the extent ` +
        `that over the years it will propose various consultation opportunities`, // Description
    new Coordinates(20, 20).toGeographyString() // Coordinates
);

const minimal_doc = new Document(
    15, // ID
    "Compilation of responses “So what the people of Kiruna think?” (15)", // Title
    DocumentType.informative_doc, // Type
    "admin", // Last modified by
);

async function insertAdmin() {
    await db("users").insert({ username: "admin", hash: "hash", salt: "salt", type: "urban_planner" });
}

describe("DB structure (constraints, basic insertions, column types)", () => {
    beforeAll(async () => {
        await db.migrate.latest();
        await dbEmpty();
    });

    afterAll(async () => {
        await dbEmpty();
        await db.destroy();
    });

    beforeEach(async () => {
        await dbEmpty();
    });

    describe("date tests", () => {
        it("testing the date timezone with Dayjs object", async () => {
            // Setup
            await insertAdmin();

            const date1 = dayjs.utc("2023-01-01");

            const my_obj = new Document(
                15, // ID
                "Compilation of responses “So what the people of Kiruna think?” (15)", // Title
                DocumentType.informative_doc, // Type
                "admin", // Last modified by
            );

            const doc1: any = my_obj.copy().toObject();
            doc1.issuance_date = date1;
            delete doc1.id;

            // Run
            await db("documents").insert(doc1);

            // Check that the dates are the same
            const res1 = await db("documents").where({ id: 1 }).first();
            expect(res1.issuance_date.toISOString()).toBe(date1.toISOString());
        });

        it("testing the date timezone with ISO string", async () => {
            // Setup
            await insertAdmin();

            const date1 = dayjs.utc("2023-01-01");
            const date2 = dayjs.utc("2023-01-01").toISOString();

            const my_obj = new Document(
                15, // ID
                "Compilation of responses “So what the people of Kiruna think?” (15)", // Title
                DocumentType.informative_doc, // Type
                "admin", // Last modified by
            );

            const doc2: any = my_obj.copy().toObject();
            doc2.issuance_date = date2;
            delete doc2.id;

            // Run
            await db("documents").insert(doc2);

            // Check that the dates are the same
            const res2 = await db("documents").where({ id: 1 }).first();
            expect(res2.issuance_date.toISOString()).toBe(date1.toISOString());
        });

        it("testing the date timezone with custom format", async () => {
            // Setup
            await insertAdmin();

            const date1 = dayjs.utc("2023-01-01");
            const date3 = dayjs.utc("2023-01-01").format('YYYY-MM-DDTHH:mm:ss[Z]');

            const my_obj = new Document(
                15, // ID
                "Compilation of responses “So what the people of Kiruna think?” (15)", // Title
                DocumentType.informative_doc, // Type
                "admin", // Last modified by
            );

            const doc3: any = my_obj.copy().toObject();
            doc3.issuance_date = date3;
            delete doc3.id;

            // Run
            await db("documents").insert(doc3);

            // Check that the dates are the same
            const res3 = await db("documents").where({ id: 1 }).first();
            expect(res3.issuance_date.toISOString()).toBe(date1.toISOString());
        });

    });

    describe("'documents' table", () => {

        /* ==================-------------- Success and main constraints tests --------------================== */
        it("should successfully insert a complete document", async () => {
            // Setup
            const doc: any = complete_doc.toObject();
            await insertAdmin();

            // Run
            await db("documents").insert(doc)

            // Check that the document is the same (except for time and coordinates for now)
            const res_doc_obj: any = await db("documents").where({id: 15}).first();
            const res_doc = Document.fromJSON(res_doc_obj);
            
            // TODO: Check time and coordinates when we fix them
            expect(res_doc.id).toBe(complete_doc.id);
            expect(res_doc.title).toBe(complete_doc.title);
            expect(res_doc.type).toBe(complete_doc.type);
            expect(res_doc.lastModifiedBy).toBe(complete_doc.lastModifiedBy);
            // expect(res_doc.issuanceDate).toBe(complete_doc.issuanceDate);
            expect(res_doc.language).toBe(complete_doc.language);
            expect(res_doc.pages).toBe(complete_doc.pages);
            expect(res_doc.stakeholders).toBe(complete_doc.stakeholders);
            expect(res_doc.scale).toBe(complete_doc.scale);
            expect(res_doc.description).toBe(complete_doc.description);
            const res_wkt_coords = await Coordinates.wkbToWktPoint(res_doc.coordinates, db)
            expect(res_wkt_coords).toBe(complete_doc.coordinates);

            // const res_doc = Document.fromJSON(res_doc_obj)
            // expect(complete_doc.issuanceDate?.format('YYYY-MM-DDTHH:mm:ss[Z]')).toBe(complete_doc.issuanceDate?.format('YYYY-MM-DDTHH:mm:ss[Z]'));
        });

        it("should successfully insert a minimal document", async () => {
            // Setup 
            const doc: any = minimal_doc.toObject();
            await insertAdmin();

            // Run
            await db("documents").insert(doc)

            // Check that the document is the same
            const res_doc_obj: any = await db("documents").where({id: 15}).first();
            const res_doc = Document.fromJSON(res_doc_obj);
            expect(res_doc).toEqual(minimal_doc);
        });
        
        it("should put 1 as autoincremented id when not specifiying id", async () => {
            // Setup
            const doc = {title: "title", type: DocumentType.design_doc, last_modified_by: "admin"};
            await insertAdmin();

            // Run
            await db("documents").insert(doc);

            // Check that the id is 1
            const res = await db("documents").select("id").where({title: "title"}).first();
            expect(res.id).toBe(1);
        });

        it("autincrement won't skip a number if one is already taken by a manual insertion (=> you have to update it manually after)", async () => {
            // Setup
            const doc = new Document(1, "title", DocumentType.design_doc, "admin").toObject();
            const doc2 = {title: "title2", type: DocumentType.design_doc, last_modified_by: "admin"};
            await insertAdmin();

            // Run
            await db("documents").insert(doc);

            // Run and Check that the autoincrement worked poorly, i.e. unique constraint violation
            expect(db("documents").insert(doc2)).rejects.toThrow(/unique constraint/i);
        });

        it("should trigger NOT NULL constraint violation on primary key", async () => {
            // Setup
            const doc = {id: null, title: "title", type: DocumentType.design_doc, last_modified_by: "admin"};
            await insertAdmin();

            // Run and Check NOT NULL constraint violation
            await expect(db("documents").insert(doc)).rejects.toThrow(/not-null/i);
        });

        it("should fail to insert a document with an invalid type", async () => {
            const doc = new Document(1, "title", "invalid_type" as DocumentType, "admin").toObject();
            await expect(db("documents").insert(doc)).rejects.toThrow(/documents_type_check/i);
        });

        it("should trigger primary key constraint violation", async () => {
            // Setup
            await insertAdmin();
            const doc = new Document(1, "title", DocumentType.design_doc, "admin").toObject();
            await db("documents").insert(doc);

            // Run and Check unique constraint violation
            await expect(db("documents").insert(doc)).rejects.toThrow(/unique constraint/i);
        });

        it("should prevent inserting with a last_modified_by that doesn't exist in the users table", async () => {
            // Setup
            const doc2 = {id: 2, title: "title2", type: DocumentType.design_doc, last_modified_by: "nonexistent_user"};

            // Run and Check foreign key constraint violation
            await expect(db("documents").insert(doc2)).rejects.toThrow(/foreign key constraint/i);
        });

        it("should cascade delete related documents when a user is deleted", async () => {
            // Setup
            await db("users").insert({ username: "test_user", hash: "hash", salt: "salt", type: "urban_planner" });
            const doc = new Document(1, "title", DocumentType.design_doc, "test_user").toObject();
            await db("documents").insert(doc);
        
            // Run
            await db("users").where({ username: "test_user" }).del();
        
            // Check that the document is also deleted
            const res = await db("documents").where({ id: 1 }).first();
            expect(res).toBeUndefined();
        });

        /* ==================-------------- Type Tests --------------================== */
        it("should not allow id to be anything other than a number", async () => {
            // Setup
            const doc = {id: "not_a_number", title: "title", type: DocumentType.design_doc, last_modified_by: "admin"};
            await insertAdmin();

            // Run and Check type constraint violation
            await expect(db("documents").insert(doc)).rejects.toThrow(/type/i);
        });

        it("should not allow title longer than 255 characters", async () => {
            // Setup
            const doc = {title: "a".repeat(256), type: DocumentType.design_doc, last_modified_by: "admin"};
            await insertAdmin();

            // Run and Check length constraint violation
            await expect(db("documents").insert(doc)).rejects.toThrow(/value too long/i);
        });

        it("should not allow issuance_date not being a valid date", async () => {
            // Setup
            const doc = {title: "title", type: DocumentType.design_doc, last_modified_by: "admin", issuance_date: "invalid_date"};
            await insertAdmin();

            // Run and Check type constraint violation
            await expect(db("documents").insert(doc)).rejects.toThrow(/type/i);
        });

        it("should not allow language longer than 255 characters", async () => {
            // Setup
            const doc = {title: "title", type: DocumentType.design_doc, last_modified_by: "admin", language: "a".repeat(256)};
            await insertAdmin();

            // Run and Check length constraint violation
            await expect(db("documents").insert(doc)).rejects.toThrow(/value too long/i);
        });

        it("should not allow pages not being a number", async () => {
            // Setup
            const doc = {title: "title", type: DocumentType.design_doc, last_modified_by: "admin", pages: "not_a_number"};
            await insertAdmin();

            // Run and Check type constraint violation
            await expect(db("documents").insert(doc)).rejects.toThrow(/type/i);
        });

        it("should not allow stakeholders longer than 255 characters", async () => {
            // Setup
            const doc = {title: "title", type: DocumentType.design_doc, last_modified_by: "admin", stakeholders: "a".repeat(256)};
            await insertAdmin();

            // Run and Check length constraint violation
            await expect(db("documents").insert(doc)).rejects.toThrow(/value too long/i);
        });

        it("should not allow scale longer than 255 characters", async () => {
            // Setup
            const doc = {title: "title", type: DocumentType.design_doc, last_modified_by: "admin", scale: "a".repeat(256)};
            await insertAdmin();

            // Run and Check length constraint violation
            await expect(db("documents").insert(doc)).rejects.toThrow(/value too long/i);
        });

        it("should not allow description longer than 2500 characters", async () => {
            // Setup
            const doc = {title: "title", type: DocumentType.design_doc, last_modified_by: "admin", description: "a".repeat(2501)};
            await insertAdmin();

            // Run and Check length constraint violation
            await expect(db("documents").insert(doc)).rejects.toThrow(/value too long/i);
        });

        it("should work with 'informative_doc' 'prescriptive_doc' 'design_doc' 'technical_doc' and 'material_effect' types", async () => {
            // Setup
            const doc1 = new Document(1, "title", DocumentType.informative_doc, "admin");
            const doc2 = new Document(2, "title", DocumentType.prescriptive_doc, "admin");
            const doc3 = new Document(3, "title", DocumentType.design_doc, "admin");
            const doc4 = new Document(4, "title", DocumentType.technical_doc, "admin");
            const doc5 = new Document(5, "title", DocumentType.material_effect, "admin");
            await insertAdmin();

            // Run
            await db("documents").insert(doc1.toObject());
            await db("documents").insert(doc2.toObject());
            await db("documents").insert(doc3.toObject());
            await db("documents").insert(doc4.toObject());
            await db("documents").insert(doc5.toObject());

            // Check that the documents are the same
            const res1 = await db("documents").where({ id: 1 }).first();
            const res2 = await db("documents").where({ id: 2 }).first();
            const res3 = await db("documents").where({ id: 3 }).first();
            const res4 = await db("documents").where({ id: 4 }).first();
            const res5 = await db("documents").where({ id: 5 }).first();
            expect(Document.fromJSON(res1)).toEqual(doc1);
            expect(Document.fromJSON(res2)).toEqual(doc2);
            expect(Document.fromJSON(res3)).toEqual(doc3);
            expect(Document.fromJSON(res4)).toEqual(doc4);
            expect(Document.fromJSON(res5)).toEqual(doc5);
        });

        it("should not allow coordinates not being a valid geometry", async () => {
            // Setup
            const doc = {title: "title", type: DocumentType.design_doc, last_modified_by: "admin", coordinates: "invalid_geometry"};
            await insertAdmin();

            // Run and Check type constraint violation
            await expect(db("documents").insert(doc)).rejects.toThrow(/type/i);
        });

        it("should accept our coordinates format (SRID=4326;POINT(xxxx yyyy))", async () => {
            // Setup
            const doc = {title: "title", type: DocumentType.design_doc, last_modified_by: "admin", coordinates: "SRID=4326;POINT(40.7128 -74.006)"};
            await insertAdmin();

            // Run
            await db("documents").insert(doc);

            // Check that the coordinates are the same
            const res = await db("documents").where({ title: "title" }).first();
            const res_wtk_coords = await Coordinates.wkbToWktPoint(res.coordinates, db); 
            expect(res_wtk_coords).toBe(doc.coordinates);
        });

        it("should not allow last_modified_by longer than 255 characters", async () => {
            // Setup
            const doc = {title: "title", type: DocumentType.design_doc, last_modified_by: "a".repeat(256)};
            await insertAdmin();

            // Run and Check length constraint violation
            await expect(db("documents").insert(doc)).rejects.toThrow(/value too long/i);
        });

        it("should not allow not null fields to be null", async () => {
            // Setup
            const doc1 = {title: null, type: DocumentType.design_doc, last_modified_by: "admin"};
            const doc2 = {title: "title", type: DocumentType.design_doc, last_modified_by: null};
            const doc3 = {title: "title", type: null, last_modified_by: "admin"};

            // Run and Check NOT NULL constraint violation
            await expect(db("documents").insert(doc1)).rejects.toThrow(/not-null/i);
            await expect(db("documents").insert(doc2)).rejects.toThrow(/not-null/i);
            await expect(db("documents").insert(doc3)).rejects.toThrow(/not-null/i);
        });
    });

    describe("'users' table", () => {
        /* ==================-------------- Success and main constraints tests --------------================== */
        it("should successfully insert a user", async () => {
            // Setup
            const user = { username: "user", hash: "hash", salt: "salt", type: "urban_planner" };

            // Run
            await db("users").insert(user);

            // Check that the user is the same
            const res = await db("users").where({ username: "user" }).first();
            expect(res).toEqual(user);
        });

        it("should trigger NOT NULL constraint violation on primary key", async () => {
            // Setup
            const user = { username: null, hash: "hash", salt: "salt", type: "urban_planner" };

            // Run and Check NOT NULL constraint violation
            await expect(db("users").insert(user)).rejects.toThrow(/not-null/i);
        });

        it("should fail to insert a user with an invalid type", async () => {
            const user = { username: "user", hash: "hash", salt: "salt", type: "invalid_type" };
            await expect(db("users").insert(user)).rejects.toThrow(/users_type_check/i);
        });

        it("should trigger primary key constraint violation", async () => {
            // Setup
            const user = { username: "user", hash: "hash", salt: "salt", type: "urban_planner" };
            await db("users").insert(user);

            // Run and Check unique constraint violation
            await expect(db("users").insert(user)).rejects.toThrow(/unique constraint/i);
        });

        /* ==================-------------- Type Tests --------------================== */
        it("should not allow username longer than 255 characters", async () => {
            // Setup
            const user = { username: "a".repeat(256), hash: "hash", salt: "salt", type: "urban_planner" };

            // Run and Check length constraint violation
            await expect(db("users").insert(user)).rejects.toThrow(/value too long/i);
        });

        it("should not allow hash longer than 255 characters", async () => {
            // Setup
            const user = { username: "user", hash: "a".repeat(256), salt: "salt", type: "urban_planner" };

            // Run and Check length constraint violation
            await expect(db("users").insert(user)).rejects.toThrow(/value too long/i);
        });

        it("should not allow salt longer than 255 characters", async () => {
            // Setup
            const user = { username: "user", hash: "hash", salt: "a".repeat(256), type: "urban_planner" };

            // Run and Check length constraint violation
            await expect(db("users").insert(user)).rejects.toThrow(/value too long/i);
        });

        it("should work with 'resident' 'urban_planner' and 'urban_developer' types", async () => {
            // Setup
            const user1 = { username: "user1", hash: "hash", salt: "salt", type: "resident" };
            const user2 = { username: "user2", hash: "hash", salt: "salt", type: "urban_planner" };
            const user3 = { username: "user3", hash: "hash", salt: "salt", type: "urban_developer" };

            // Run
            await db("users").insert(user1);
            await db("users").insert(user2);
            await db("users").insert(user3);

            // Check that the users are the same
            const res1 = await db("users").where({ username: "user1" }).first();
            const res2 = await db("users").where({ username: "user2" }).first();
            const res3 = await db("users").where({ username: "user3" }).first();
            expect(res1).toEqual(user1);
            expect(res2).toEqual(user2);
            expect(res3).toEqual(user3);
        });

        it("should not allow not null fields to be null", async () => {
            // Setup
            const user1 = { username: null, hash: "hash", salt: "salt", type: "urban_planner" };
            const user2 = { username: "user", hash: null, salt: "salt", type: "urban_planner" };
            const user3 = { username: "user", hash: "hash", salt: null, type: "urban_planner" };
            const user4 = { username: "user", hash: "hash", salt: "salt", type: null };

            // Run and Check NOT NULL constraint violation
            await expect(db("users").insert(user1)).rejects.toThrow(/not-null/i);
            await expect(db("users").insert(user2)).rejects.toThrow(/not-null/i);
            await expect(db("users").insert(user3)).rejects.toThrow(/not-null/i);
            await expect(db("users").insert(user4)).rejects.toThrow(/not-null/i);
        });
    });

    describe("'document_links' table", () => {
        /* ==================-------------- Success and main constraints tests --------------================== */
        it("should succeed to insert a complete document link", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("documents").insert({ id: 2, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            const link: any = { doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01").toISOString() };

            // Run
            await db("document_links").insert(link);

            // Check that the link is the same
            let res = await db("document_links").where({ link_id: 1 }).first();
            res["created_at"]  = res["created_at"].toISOString();
            link["link_id"] = 1;
            expect(res).toEqual(link);
        });

        it("should put 1 as autoincremented link_id when not specifiying link_id", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("documents").insert({ id: 2, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            const link = { doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01") };

            // Run
            await db("document_links").insert(link);

            // Check that the link_id is 1
            const res = await db("document_links").select("link_id").where({ doc_id1: 1, doc_id2: 2 }).first();
            expect(res.link_id).toBe(1);
        });

        it("autincrement won't skip a number if one is already taken by a manual insertion (=> you have to update it manually after)", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("documents").insert({ id: 2, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            const link = { link_id: 1, doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01") };
            const link2 = { doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01") };

            // Run
            await db("document_links").insert(link);

            // Run and Check that the autoincrement worked poorly, i.e. unique constraint violation
            await expect(db("document_links").insert(link2)).rejects.toThrow(/unique constraint/i);
        });

        it("should trigger primary key constraint violation", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("documents").insert({ id: 2, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            const link = { link_id: 1, doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01") };
            await db("document_links").insert(link);

            // Run and Check unique constraint violation
            await expect(db("document_links").insert(link)).rejects.toThrow(/unique constraint/i);
        });

        it("shouldn't trigger unique key constraint violation if id1 and id2 are the repeated but linktype is different", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("documents").insert({ id: 2, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            const link1 = { link_id: 1, doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01").toISOString() };
            const link2 = { link_id: 2, doc_id1: 1, doc_id2: 2, link_type: "collateral", created_at: dayjs.utc("2023-01-01").toISOString() };

            // Run
            await db("document_links").insert(link1);
            await db("document_links").insert(link2);

            // Check that the links are the same
            const res1 = await db("document_links").where({ doc_id1: 1, doc_id2: 2, link_type: "direct" }).first()
                .then((res) => {res["created_at"] = res["created_at"].toISOString(); return res});
            const res2 = await db("document_links").where({ doc_id1: 1, doc_id2: 2, link_type: "collateral" }).first()
                .then((res) => {res["created_at"] = res["created_at"].toISOString(); return res});
            expect(res1).toEqual(link1);
            expect(res2).toEqual(link2);
        });

        it("should trigger unique key constraint violation if id1, id2, and linktype are repeated", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("documents").insert({ id: 2, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            const link1 = { doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01") };
            const link2 = { doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01") };

            await db("document_links").insert(link1)

            // Run and Check unique constraint violation
            await expect(db("document_links").insert(link2)).rejects.toThrow(/unique constraint/i);
        });

        it("should trigger foreign key constraint violation if doc_id1 doesn't exist in documents", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 2, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            const link = { doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01") };
            
            // Run and Check foreign key constraint violation
            await expect(db("document_links").insert(link)).rejects.toThrow(/foreign key constraint/i);
        });
        
        it("should trigger foreign key constraint violation if doc_id2 doesn't exist in documents", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            const link = { doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01") };

            // Run and Check foreign key constraint violation
            await expect(db("document_links").insert(link)).rejects.toThrow(/foreign key constraint/i);
        });

        it("should cascade delete related document links when a document is deleted", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("documents").insert({ id: 2, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            const link = { link_id: 1, doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01") };
            await db("document_links").insert(link);
        
            // Run
            await db("documents").where({ id: 1 }).del();
        
            // Check that the document link is also deleted
            const res = await db("document_links").where({ link_id: 1 }).first();
            expect(res).toBeUndefined();
        });

        /* ==================-------------- Type Tests --------------================== */
        it("should not allow link_id to be anything other than a number", async () => {
            // Setup
            await insertAdmin();
            const link = { link_id: "nan", doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01") };

            // Run and Check type constraint violation
            await expect(db("document_links").insert(link)).rejects.toThrow(/type/i);
        });

        it("should not allow doc1 to be anything other than a number", async () => {
            // Setup
            await insertAdmin();
            const link = { doc_id1: "nan", doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01") };

            // Run and Check type constraint violation
            await expect(db("document_links").insert(link)).rejects.toThrow(/type/i);
        });

        it("should not allow doc2 to be anything other than a number", async () => {
            // Setup
            await insertAdmin();
            const link = { doc_id1: 1, doc_id2: "nan", link_type: "direct", created_at: dayjs.utc("2023-01-01") };

            // Run and Check type constraint violation
            await expect(db("document_links").insert(link)).rejects.toThrow(/type/i);
        });

        it("should not allow link_type be anything other than 'direct', 'collateral', 'projection', 'update'", async () => {
            // Setup
            const link = { doc_id1: 1, doc_id2: 2, link_type: "invalid_type", created_at: dayjs.utc("2023-01-01") };

            // Run and Check type constraint violation
            await expect(db("document_links").insert(link)).rejects.toThrow(/document_links_link_type_check/i);
        });

        it("should work with 'direct', 'collateral', 'projection', 'update' link types", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("documents").insert({ id: 2, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("documents").insert({ id: 3, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("documents").insert({ id: 4, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            const link1 = { link_id: 1, doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: dayjs.utc("2023-01-01").toISOString() };
            const link2 = { link_id: 2, doc_id1: 2, doc_id2: 1, link_type: "collateral", created_at: dayjs.utc("2023-01-01").toISOString() };
            const link3 = { link_id: 3, doc_id1: 3, doc_id2: 4, link_type: "projection", created_at: dayjs.utc("2023-01-01").toISOString() };
            const link4 = { link_id: 4, doc_id1: 4, doc_id2: 1, link_type: "update", created_at: dayjs.utc("2023-01-01").toISOString() };

            // Run
            await db("document_links").insert(link1);
            await db("document_links").insert(link2);
            await db("document_links").insert(link3);
            await db("document_links").insert(link4);

            // Check that the links are the same
            const res1 = await db("document_links").where({ link_id: 1 }).first().then((res) => {res["created_at"] = res["created_at"].toISOString(); return res});
            const res2 = await db("document_links").where({ link_id: 2 }).first().then((res) => {res["created_at"] = res["created_at"].toISOString(); return res});
            const res3 = await db("document_links").where({ link_id: 3 }).first().then((res) => {res["created_at"] = res["created_at"].toISOString(); return res});
            const res4 = await db("document_links").where({ link_id: 4 }).first().then((res) => {res["created_at"] = res["created_at"].toISOString(); return res});

            expect(res1).toEqual(link1);
            expect(res2).toEqual(link2);
            expect(res3).toEqual(link3);
            expect(res4).toEqual(link4);
        });

        it("should not allow created_at not being a valid date", async () => {
            // Setup
            const link = { doc_id1: 1, doc_id2: 2, link_type: "direct", created_at: "invalid_date" };

            // Run and Check type constraint violation
            await expect(db("document_links").insert(link)).rejects.toThrow(/type/i);
        });
    });

    describe("'files' table", () => {
        /* ==================-------------- Success and main constraints tests --------------================== */
        it("should successfully insert a complete file", async () => {
            // Setup
            const file = { id: 1, file_url: "url", uploaded_at: dayjs.utc("2023-01-01").toISOString() };

            // Run
            await db("files").insert(file);

            // Check that the file is the same
            const res = await db("files").where({ id: 1 }).first().then((res) => {res["uploaded_at"] = res["uploaded_at"].toISOString(); return res});
            expect(res).toEqual(file);
        });

        it("should succesfully insert a minimal file", async () => {
            // Setup
            const file = { id: 1, file_url: "url" };

            // Run
            await db("files").insert(file);

            // Check that the file is the same
            const res = await db("files").where({ id: 1 }).first();
            expect(res.id).toBe(1);
            expect(res.file_url).toBe("url");
            expect(res.uploaded_at).not.toBeUndefined();
        });

        it("should put 1 as autoincremented id when not specifiying id", async () => {
            // Setup
            const file = { file_url: "url" };

            // Run
            await db("files").insert(file);

            // Check that the id is 1
            const res = await db("files").select("id").where({ file_url: "url" }).first();
            expect(res.id).toBe(1);
        });

        it("autincrement won't skip a number if one is already taken by a manual insertion (=> you have to update it manually after)", async () => {
            // Setup
            const file = { id: 1, file_url: "url" };
            const file2 = { file_url: "url2" };

            // Run
            await db("files").insert(file);

            // Run and Check that the autoincrement worked poorly, i.e. unique constraint violation
            await expect(db("files").insert(file2)).rejects.toThrow(/unique constraint/i);
        });

        it("should trigger primary key constraint violation", async () => {
            // Setup
            const file = { id: 1, file_url: "url" };
            await db("files").insert(file);

            // Run and Check unique constraint violation
            await expect(db("files").insert(file)).rejects.toThrow(/unique constraint/i);
        });

        /* ==================-------------- Type Tests --------------================== */
        it("should not allow id to be anything other than a number", async () => {
            // Setup
            const file = { id: "nan", file_url: "url" };

            // Run and Check type constraint violation
            await expect(db("files").insert(file)).rejects.toThrow(/type/i);
        });

        it("should not allow file_url longer than 255 characters", async () => {
            // Setup
            const file = { id: 1, file_url: "a".repeat(256) };

            // Run and Check length constraint violation
            await expect(db("files").insert(file)).rejects.toThrow(/value too long/i);
        });

        it("should not allow created_at not being a valid date", async () => {
            // Setup
            const file = { id: 1, file_url: "url", uploaded_at: "invalid_date" };

            // Run and Check type constraint violation
            await expect(db("files").insert(file)).rejects.toThrow(/type/i);
        });

        it("should not allow not null fields to be null", async () => {
            // Setup
            const file1 = { id: null, file_url: "url" };
            const file2 = { id: 1, file_url: null };

            // Run and Check NOT NULL constraint violation
            await expect(db("files").insert(file1)).rejects.toThrow(/not-null/i);
            await expect(db("files").insert(file2)).rejects.toThrow(/not-null/i);
        });
    })

    describe("'document_files' table", () => {
        it("should successfully insert a complete document file", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("files").insert({ id: 1, file_url: "url", uploaded_at: dayjs.utc("2023-01-01").toISOString() });
            const doc_file = { doc_id: 1, file_id: 1, role: "attachment" };

            // Run
            await db("document_files").insert(doc_file);

            // Check that the document file is the same
            const res = await db("document_files").where({ doc_id: 1, file_id: 1 }).first();
            expect(res).toEqual(doc_file);
        });

        it("should trigger unique key constraint violation if doc_id and file_id are repeated", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("files").insert({ id: 1, file_url: "url", uploaded_at: dayjs.utc("2023-01-01").toISOString() });
            const doc_file = { doc_id: 1, file_id: 1, role: "attachment" };
            await db("document_files").insert(doc_file);

            // Run and Check unique constraint violation
            await expect(db("document_files").insert(doc_file)).rejects.toThrow(/unique constraint/i);
        });

        it("should trigger foreign key constraint violation if doc_id doesn't exist in documents", async () => {
            // Setup
            await insertAdmin();
            await db("files").insert({ id: 1, file_url: "url", uploaded_at: dayjs.utc("2023-01-01").toISOString() });
            const doc_file = { doc_id: 1, file_id: 1, role: "attachment" };

            // Run and Check foreign key constraint violation
            await expect(db("document_files").insert(doc_file)).rejects.toThrow(/foreign key constraint/i);
        });

        it("should trigger foreign key constraint violation if file_id doesn't exist in files", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            const doc_file = { doc_id: 1, file_id: 1, role: "attachment" };

            // Run and Check foreign key constraint violation
            await expect(db("document_files").insert(doc_file)).rejects.toThrow(/foreign key constraint/i);
        });

        it("should cascade delete related document files when a document is deleted", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("files").insert({ id: 1, file_url: "url", uploaded_at: dayjs.utc("2023-01-01").toISOString() });
            const doc_file = { doc_id: 1, file_id: 1, role: "attachment" };
            await db("document_files").insert(doc_file);

            // Run
            await db("documents").where({ id: 1 }).del();

            // Check that the document file is also deleted
            const res = await db("document_files").where({ doc_id: 1, file_id: 1 }).first();
            expect(res).toBeUndefined();
        });

        it("should cascade delete related document files when a file is deleted", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            await db("files").insert({ id: 1, file_url: "url", uploaded_at: dayjs.utc("2023-01-01").toISOString() });
            const doc_file = { doc_id: 1, file_id: 1, role: "attachment" };
            await db("document_files").insert(doc_file);

            // Run
            await db("files").where({ id: 1 }).del();

            // Check that the document file is also deleted
            const res = await db("document_files").where({ doc_id: 1, file_id: 1 }).first();
            expect(res).toBeUndefined();
        });

        /* ==================-------------- Type Tests --------------================== */
        it("should not allow doc_id to be anything other than a number", async () => {
            // Setup
            await insertAdmin();
            await db("files").insert({ id: 1, file_url: "url", uploaded_at: dayjs.utc("2023-01-01").toISOString() });
            const doc_file = { doc_id: "nan", file_id: 1, role: "attachment" };

            // Run and Check type constraint violation
            await expect(db("document_files").insert(doc_file)).rejects.toThrow(/type/i);
        });

        it("should not allow file_id to be anything other than a number", async () => {
            // Setup
            await insertAdmin();
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            const doc_file = { doc_id: 1, file_id: "nan", role: "attachment" };

            // Run and Check type constraint violation
            await expect(db("document_files").insert(doc_file)).rejects.toThrow(/type/i);
        });

        it("should not allow role to be anything other than 'attachment' and 'original_resource'", async () => {
            // Setup
            const doc_file = { doc_id: 1, file_id: 1, role: "invalid_role" };

            // Run and Check type constraint violation
            await expect(db("document_files").insert(doc_file)).rejects.toThrow(/document_files_role_check/i);
        });

        it("should work with 'attachment' and 'original_resource' roles", async () => {
            // Setup
            await insertAdmin();
            await db("files").insert({ id: 1, file_url: "url", uploaded_at: dayjs.utc("2023-01-01").toISOString() });
            await db("files").insert({ id: 2, file_url: "url", uploaded_at: dayjs.utc("2023-01-01").toISOString() });
            await db("documents").insert({ id: 1, title: "title", type: DocumentType.design_doc, last_modified_by: "admin" });
            const doc_file1 = { doc_id: 1, file_id: 1, role: "attachment" };
            const doc_file2 = { doc_id: 1, file_id: 2, role: "attachment" };

            // Run
            await db("document_files").insert(doc_file1);
            await db("document_files").insert(doc_file2);

            // Check that the document files are the same
            const res1 = await db("document_files").where({ doc_id: 1, file_id: 1, role: "attachment" }).first();
            const res2 = await db("document_files").where({ doc_id: 1, file_id: 2, role: "attachment" }).first();
            expect(res1).toEqual(doc_file1);
            expect(res2).toEqual(doc_file2);
        });

        it("should not allow not null fields to be null", async () => {
            // Setup
            const doc_file1 = { doc_id: null, file_id: 1, role: "attachment" };
            const doc_file2 = { doc_id: 1, file_id: null, role: "attachment" };
            const doc_file3 = { doc_id: 1, file_id: 1, role: null };

            // Run and Check NOT NULL constraint violation
            await expect(db("document_files").insert(doc_file1)).rejects.toThrow(/not-null/i);
            await expect(db("document_files").insert(doc_file2)).rejects.toThrow(/not-null/i);
            await expect(db("document_files").insert(doc_file3)).rejects.toThrow(/not-null/i);
        });
    });
});