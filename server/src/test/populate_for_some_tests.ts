import { SAMPLE_USERS } from "../db/sample_data/sample_users";
import { docs_stakeholders, actualDocuments } from "../db/actual_data/documents";
import { DocumentLink, LinkType } from "../models/document";
import dayjs from "dayjs";
import { SAMPLE_FILES } from "../db/sample_data/sample_files";
import { SAMPLE_DOC_FILES } from "../db/sample_data/sample_doc_files";

import knex from "../db/db";
import { ACTUAL_STAKEHOLDERS } from "../db/actual_data/actual_stakeholders";


export async function populate() {
    try {
        // Insert __SAMPLE__ users
        for (let user of SAMPLE_USERS) {
            await knex('users').insert(user);
        }
        // console.log("Sample users inserted.");

        // insert actual stakeholders
        for (const stakeholder of ACTUAL_STAKEHOLDERS) {
            await knex('stakeholders').insert(stakeholder);
        }
        
        // Insert __ACTUAL__ documents
        for (let document of actualDocuments) {
            await knex('documents').insert(document.toObjectWithoutStakeholders());
            //await knex('documents').insert(document.toObject());
        }
        // console.log("Actual documents inserted.");

        // insert actual docs_stakeholders
        for (const doc_stakeholder of docs_stakeholders) {
            await knex('documents_stakeholders').insert(doc_stakeholder);
        }
        // console.log("Actual docs_stakeholders inserted.");

        // Insert __SAMPLE__ document links
        const doclink1 = new DocumentLink(1, 15, 18, LinkType.direct, dayjs()).toObjectWithoutId(); // The id field can be whatever cause we take it out anyway using toObjectWithoutId()
        const doclink2 = new DocumentLink(1, 18, 41, LinkType.collateral, dayjs()).toObjectWithoutId(); // The id field can be whatever cause we take it out anyway using toObjectWithoutId()
        await knex('document_links').insert(doclink1);
        await knex('document_links').insert(doclink2);
        // console.log("Sample document links inserted.");

        // Insert __SAMPLE__ files
        for (let file of SAMPLE_FILES) {
            await knex('files').insert(file);
        }
        // console.log("Sample files inserted.");

        // Insert __SAMPLE__ document files
        for (let docFile of SAMPLE_DOC_FILES) {
            await knex('document_files').insert(docFile);
        }
        // console.log("Sample document files inserted.");

    } catch (error) {
        console.error("Error populating database with (only some for now) actual data:", error);
        // dbEmpty();
    }
}