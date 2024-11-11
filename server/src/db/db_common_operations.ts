import { Knex } from "knex";
import knex from "./db"; // Assuming you have a knex instance exported from db.ts
import { Document, DocumentLink, LinkType } from "../models/document";
import dayjs from "dayjs";

// Data (actual and sample)
import actualDocuments from "./actual_data/documents";
import { SAMPLE_DOC_FILES } from "./sample_data/sample_doc_files";
import { SAMPLE_FILES } from "./sample_data/sample_files";
import { SAMPLE_USERS } from "./sample_data/sample_users";
import db from "./db";

// Database Populate function
export async function dbPopulate() {
    try {
        // Insert users
        await knex('users').insert([
            { username: 'user1', hash: 'hash1', salt: 'salt1', type: 'resident' },
            { username: 'user2', hash: 'hash2', salt: 'salt2', type: 'urban_planner' }
        ]);
        // console.log("Sample users inserted.");

        // Insert documents and retrieve their IDs
        const [doc1, doc2] = await Promise.all([
            knex('documents').insert({
                title: 'Document 1',
                issuance_date: new Date(),
                language: 'English',
                pages: 5,
                stakeholders: 'Stakeholder A',
                scale: '1:1000',
                description: 'Test Document 1',
                type: 'informative_doc',
                last_modified_by: 'user1'
            }).returning('id'),
            knex('documents').insert({
                title: 'Document 2',
                issuance_date: new Date(),
                language: 'Spanish',
                pages: 3,
                stakeholders: 'Stakeholder B',
                scale: '1:2000',
                description: 'Test Document 2',
                type: 'technical_doc',
                last_modified_by: 'user2'
            }).returning('id')
        ]);

        // console.log("Sample documents inserted.");

        // Insert document links using valid document IDs
        await knex('document_links').insert([
            { doc_id1: doc1[0].id, doc_id2: doc2[0].id, link_type: 'direct', created_at: new Date() }
        ]);
        // console.log("Sample document links inserted.");
        
    } catch (error) {
        console.error("Error populating database:", error);
    }
}


export async function dbEmpty() {
    try {
        await knex.raw('TRUNCATE TABLE document_files, document_links, files, documents, users RESTART IDENTITY CASCADE');
        // console.log("Database emptied successfully.");
    } catch (error) {
        console.error("Error emptying database:", error);
    }
}




// Database Read function
export async function dbRead() {
  try {
    const users = await knex("users").select("*");
    const documents = await knex("documents").select("*");
    const documentLinks = await knex("document_links").select("*");
    const files = await knex("files").select("*");
    const documentFiles = await knex("document_files").select("*");
    return { users, documents, documentLinks, files, documentFiles };
  } catch (error) {
    console.error("Error reading database:", error);
    return null;
  }
}

export async function dbUpdate(table: string, conditions: Record<string, any>, updates: Record<string, any>): Promise<number> {
    try {
        // console.log(`Updating ${table} with conditions:`, conditions, 'and updates:', updates); // Add this for debugging
        // this returns the array of updated rows, we only need to count them and return the count
        let updated = await knex(table)
            .where(conditions)
            .update(updates)
            .returning('*');
        // console.log(`Successfully updated ${table}`);
        return updated.length;
    } catch (e) {
        console.error(`Error updating the ${table} table`, e);
        return 0;
    }
}

export async function dbPopulateActualData() {
    try {
        // Insert __SAMPLE__ users
        for (let user of SAMPLE_USERS) {
            await knex('users').insert(user);
        }
        // console.log("Sample users inserted.");

        // Insert __ACTUAL__ documents
        for (let document of actualDocuments) {
            await knex('documents').insert(document.toObject());
        }
        // console.log("Actual documents inserted.");

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
    

// Changelog
// Dragos 2024-11-06: Added dbPopulateActualData function for population with real data
