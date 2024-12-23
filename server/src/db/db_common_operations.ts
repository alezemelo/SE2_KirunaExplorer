import fs from 'fs';
import dayjs from "dayjs";

import knex from "./db"; // Assuming you have a knex instance exported from db.ts
import { Document, DocumentLink, LinkType } from "../models/document";
import { files_dir_name } from "../rcd/routes/file_routes";

// Data (actual and sample)
import { ACTUAL_DOCTYPES } from "./actual_data/actual_doctypes";
import { actualDocuments, docs_stakeholders } from "./actual_data/documents";
import { ACTUAL_STAKEHOLDERS } from "./actual_data/actual_stakeholders";
import { ACTUAL_DOC_FILES } from "./actual_data/actual_doc_files";
import { ACTUAL_FILES } from "./actual_data/actual_files";
import { SAMPLE_USERS } from "./sample_data/sample_users";
import db from "./db";
import ACTUAL_SCALES from "./actual_data/actual_scales";
import path from 'path';

// Database Populate function
export async function dbPopulate() {
    try {


        // inserts sample stakeholder and sample doctypes
        await knex('stakeholders').insert([
            { name: 'Stakeholder A' },
        ]);
        await knex('doctypes').insert([
            {name: 'informative_doc'},
            {name: 'technical_doc'},
        ]);
        await knex('scales').insert([
            {value: 'text'},
            {value: '1:8000'},
            {value: '1:7500'},
            {value: '1:12000'},
            {value: '1:1000'},
            {value: 'blueprints/effects'}
        ]);


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
                //stakeholders: 'Stakeholder A',
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
                //stakeholders: 'Stakeholder B',
                scale: '1:8000',
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
        
        
        
    } catch (error) {
        console.error("Error populating database:", error);
    }
}


export async function dbEmpty() {
    try {
        await knex.raw('TRUNCATE TABLE document_files, document_stakeholders, stakeholders, document_links, files, documents, doctypes, scales, users RESTART IDENTITY CASCADE');
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
    const stakeholders = await knex("stakeholders").select("*");
    const doctypes= await knex("doctypes").select("*");
    const scales = await knex("scales").select("*");
    const documentStakeholders = await knex("document_stakeholders").select("*");
    return { users, documents, stakeholders, doctypes, scales, documentStakeholders, documentLinks, files, documentFiles };
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
        // Insert SAMPLE users
        for (let user of SAMPLE_USERS) {
            await knex('users').insert(user);
        }
        // console.log("Sample users inserted.");

        // insert ACTUAL stakeholders
        for (const stakeholder of ACTUAL_STAKEHOLDERS) {
            await knex('stakeholders').insert(stakeholder);
        }

        // insert ACTUAL doctypes
        for (const doctype of ACTUAL_DOCTYPES) {
            await knex('doctypes').insert(doctype);
        }

        // insert ACTUAL scales
        for (const scale of ACTUAL_SCALES) {
            await knex('scales').insert(scale);
        }

        // Insert ACTUAL documents
        for (let document of actualDocuments) {
            await knex('documents').insert(document.toObjectWithoutStakeholders());
            //await knex('documents').insert(document.toObject());
        }
        // console.log("Actual documents inserted.");

        // insert ACTUAL docs_stakeholders
        for (const doc_stakeholder of docs_stakeholders) {
            await knex('document_stakeholders').insert(doc_stakeholder);
        }

        // Insert SAMPLE document links
        const direct_15_to_18 = new DocumentLink(1, 15, 18, LinkType.direct, dayjs()).toObjectWithoutId(); // The id field can be whatever cause we take it out anyway using toObjectWithoutId()
        const collateral_18_to_41 = new DocumentLink(1, 18, 41, LinkType.collateral, dayjs()).toObjectWithoutId(); // The id field can be whatever cause we take it out anyway using toObjectWithoutId()
        const projection_41_to_47 = new DocumentLink(1, 41, 47, LinkType.projection, dayjs()).toObjectWithoutId();
        const update_47_to_64 = new DocumentLink(1, 47, 64, LinkType.update, dayjs()).toObjectWithoutId();
        await knex('document_links').insert(direct_15_to_18);
        await knex('document_links').insert(collateral_18_to_41);
        await knex('document_links').insert(projection_41_to_47);
        await knex('document_links').insert(update_47_to_64);
        // also add some double connections
        const direct_15_to_50 = new DocumentLink(1, 15, 50, LinkType.direct, dayjs()).toObjectWithoutId();
        const collateral_15_to_50 = new DocumentLink(1, 15, 50, LinkType.collateral, dayjs()).toObjectWithoutId();
        await knex('document_links').insert(direct_15_to_50);
        await knex('document_links').insert(collateral_15_to_50);
        // console.log("Sample document links inserted.");

        // Insert ACTUAL files
        for (let file of ACTUAL_FILES) {
            await knex('files').insert(file);
        }
        // console.log("Sample files inserted.");

        // Insert ACTUAL document files
        for (let docFile of ACTUAL_DOC_FILES) {
            await knex('document_files').insert(docFile);
        }
        // console.log("Sample document files inserted.");

        console.log("Database populated with actual data.");
    } catch (error) {
        console.error("Error populating database with (only some for now) actual data:", error);
        // dbEmpty();
    }
}

/* 
    * Remove unwanted files from the static directory.
    * This function reads the list of files in the static directory and deletes the ones that are not in SAMPLE_FILES.
    * TODO use actualfiles when they're available
    */
export async function removeUnwantedFilesFromStaticDirectory() {
    // Get the list of file names from ACTUAL_FILES
    const fileNames = ACTUAL_FILES.map(file => file.file_name);

    // Read the list of files in the static directory
    fs.readdir(files_dir_name, (err, files) => {
        if (err) {
            console.error('Error reading static directory:', err);
            return;
        }

        // Filter out the files that are not in SAMPLE_FILES
        const unwantedFiles = files.filter(file => !fileNames.includes(file));

        // Remove the unwanted files
        unwantedFiles.forEach(file => {
            const filePath = path.join(files_dir_name, file);
            fs.unlink(filePath, err => {
                if (err) {
                    console.error('Error deleting file:', path.relative(process.cwd(), filePath), err);
                } else {
                    console.log('Deleted file:', path.relative(process.cwd(), filePath));
                }
            });
        });
    });
}
    

// Changelog
// Dragos 2024-11-06: Added dbPopulateActualData function for population with real data
