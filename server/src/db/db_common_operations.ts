// import db.ts
import { pool, closePool } from "./db";
import { SAMPLE_USERS } from "./sample_data/sample_users";
import { SAMPLE_DOCS } from "./sample_data/sample_docs";
import { SAMPLE_DOC_LINKS } from "./sample_data/sample_doc_links";
import { SAMPLE_FILES } from "./sample_data/sample_files";
import { SAMPLE_DOC_FILES } from "./sample_data/sample_doc_files";

const INSERT_USERS_QUERY = "INSERT INTO users (username, hash, salt, type) VALUES ($1, $2, $3, $4)";
const INSERT_DOCUMENT_QUERY = "INSERT INTO documents (title, issuance_date, language, pages, stakeholders, scale, description, type, coordinates, last_modified_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ST_GeographyFromText($9), $10)";
const INSERT_DOCUMENT_LINKS_QUERY = "INSERT INTO document_links (doc_id1, doc_id2, link_type, created_at) VALUES ($1, $2, $3, $4)";
const INSERT_FILE_QUERY = "INSERT INTO files (file_url, uploaded_at) VALUES ($1, $2)";
const INSERT_DOCUMENT_FILES_QUERY = "INSERT INTO document_files (doc_id, file_id, role) VALUES ($1, $2, $3)";

//Populates the db with sample data
// TODO: CHANGE THESE METHODS FROM 'pg' to 'knex' methods
// insert queries above shouldn't be needed anymore but keep them just for reference

async function dbPopulate() {
    try {
        // adds the sample users
        for (const user of SAMPLE_USERS) {
            await pool.query(INSERT_USERS_QUERY, [user.username, user.hash, user.salt, user.type]);
        }
        console.log("done inserting sample users");
        // adds the sample docs
        for (const doc of SAMPLE_DOCS) {
            await pool.query(INSERT_DOCUMENT_QUERY, [doc.title, doc.issuanceDate, doc.language, doc.pages, doc.stakeholders, doc.scale, doc.description, doc.type, doc.coordinates, doc.lastModifiedBy]);
        }
        console.log("done inserting sample docs");
        // adds sample links between docs
        for (const link of SAMPLE_DOC_LINKS) {
            await pool.query(INSERT_DOCUMENT_LINKS_QUERY, [link.docId1, link.docId2, link.linkType, link.createdAt]);
        }
        console.log("done inserting sample links");
        // adds sample files
        for (const file of SAMPLE_FILES) {
            await pool.query(INSERT_FILE_QUERY, [file.fileUrl, file.uploadedAt]);
        }
        console.log("done inserting sample files");
        // adds sample linke from docs to files
        for (const docFile of SAMPLE_DOC_FILES) {
            await pool.query(INSERT_DOCUMENT_FILES_QUERY, [docFile.docId, docFile.fileId, docFile.role]);
        }
        console.log("done inserting sample links from docs to files");
    } catch (e) {
        console.error("error populating db with sample data", e);
    }
}


// TODO: these exported methods should also be implemented (except dbCreate and dbDelete, knex migration tool takes care of that)
// export {dbCreate, dbDelete, dbEmpty, dbPopulate, dbRead, dbUpdate} 