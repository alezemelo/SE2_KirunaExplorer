// import db.ts
import { pool, closePool } from "./db";
import { SAMPLE_USERS } from "./sample_data/sample_users";
import { SAMPLE_DOCS } from "./sample_data/sample_docs";
import { SAMPLE_DOC_LINKS } from "./sample_data/sample_doc_links";
import { SAMPLE_FILES } from "./sample_data/sample_files";
import { SAMPLE_DOC_FILES } from "./sample_data/sample_doc_files";
import knex, { Knex } from "knex";

const INSERT_USERS_QUERY = "INSERT INTO users (username, hash, salt, type) VALUES ($1, $2, $3, $4)";
const INSERT_DOCUMENT_QUERY = "INSERT INTO documents (title, issuance_date, language, pages, stakeholders, scale, description, type, coordinates, last_modified_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ST_GeographyFromText($9), $10)";
const INSERT_DOCUMENT_LINKS_QUERY = "INSERT INTO document_links (doc_id1, doc_id2, link_type, created_at) VALUES ($1, $2, $3, $4)";
const INSERT_FILE_QUERY = "INSERT INTO files (file_url, uploaded_at) VALUES ($1, $2)";
const INSERT_DOCUMENT_FILES_QUERY = "INSERT INTO document_files (doc_id, file_id, role) VALUES ($1, $2, $3)";

//Populates the db with sample data
// TODO: CHANGE THESE METHODS FROM 'pg' to 'knex' methods
// insert queries above shouldn't be needed anymore but keep them just for reference

export async function dbPopulate() {
    try {
        // Adds the sample users
        for (const user of SAMPLE_USERS) {
            await knex('users').insert({
                username: user.username,
                hash: user.hash,
                salt: user.salt,
                type: user.type
            });
        }
        console.log("done inserting sample users");

        // Adds the sample documents
        for (const doc of SAMPLE_DOCS) {
            await knex('documents').insert({
                title: doc.title,
                issuanceDate: doc.issuanceDate,
                language: doc.language,
                pages: doc.pages,
                stakeholders: doc.stakeholders,
                scale: doc.scale,
                description: doc.description,
                type: doc.type,
                coordinates: doc.coordinates,
                lastModifiedBy: doc.lastModifiedBy
            });
        }
        console.log("done inserting sample docs");

        // Adds sample links between documents
        for (const link of SAMPLE_DOC_LINKS) {
            await knex('document_links').insert({
                docId1: link.docId1,
                docId2: link.docId2,
                linkType: link.linkType,
                createdAt: link.createdAt
            });
        }
        console.log("done inserting sample links");

        // Adds sample files
        for (const file of SAMPLE_FILES) {
            await knex('files').insert({
                fileUrl: file.fileUrl,
                uploadedAt: file.uploadedAt
            });
        }
        console.log("done inserting sample files");

        // Adds sample links from documents to files
        for (const docFile of SAMPLE_DOC_FILES) {
            await knex('document_files').insert({
                docId: docFile.docId,
                fileId: docFile.fileId,
                role: docFile.role
            });
        }
        console.log("done inserting sample links from docs to files");
    } catch (e) {
        console.error("error populating db with sample data", e);
    }
}
//Database empty function

export async function dbEmpty() {
    try {
        await knex('document_files').truncate();
        await knex('document_links').truncate();
        await knex('files').truncate();
        await knex('documents').truncate();
        await knex('users').truncate();

    }
    catch (e) {
        console.error("error emptying the db", e);
    };
}

//Database read function

export async function dbRead() {
    try {
        const users = await knex('users').select('*');
        const docs = await knex('documents').select('*');
        const docLinks = await knex('document_links').select('*');
        const files = await knex('files').select('*');
        const docFiles = await knex('document_files').select('*');
        console.log(users, docs, docLinks, files, docFiles);
    }
    catch (e) {
        console.error("error reading the db", e);
    };
}

//Database update function

export async function dbUpdate(table: string | knex.Knex.Config<any>, conditions: knex.Knex.Raw<any>, updates: any) {
    try {
        await knex(table)
            .where(conditions)
            .update(updates);
            
        console.log(`Successfully updated ${table}`);
    } catch (e) {
        console.error(`Error updating the ${table} table`, e);
    }
}


//Database delete function

export async function dbDelete(table: string | knex.Knex.Config<any>, conditions: knex.Knex.Raw<any>) {
    try {

        await knex(table)
            .where(conditions)
            .del();
            
        console.log(`Successfully deleted from ${table}`);
    } catch (e) {
        console.error(`Error deleting from the ${table} table`, e);
    }
}

// TODO: these exported methods should also be implemented (except dbCreate and dbDelete, knex migration tool takes care of that)
// export {dbCreate, dbDelete, dbEmpty, dbPopulate, dbRead, dbUpdate} 



// Ali_Noohi

// >> I have implemented the DBEmpty, DBRead, DBUpdate, and DBDelete functions in the db_common_operations.ts file.

// ********************************************************************************************************************

// DBCreate is not needed because of migrations 

// DB Delete and DB Update are implemeneted with necessary parameters 

// DB Delete and DB Empty have been implemented with different purposes

// ********************************************************************************************************************

