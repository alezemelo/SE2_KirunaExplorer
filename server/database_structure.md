# USERS

* username: VARCHAR, PRIMARY KEY, NOT NULL
* hash: VARCHAR, NOT NULL
* salt: VARCHAR, NOT NULL
* type: ENUM (resident, urban planner, urban developer)\*

\* currently no difference between what an urban planner or urban developer can do, just keep the difference stored in the db to future proof the application in case of change in requirements

---

# DOCUMENTS

* id: SERIAL, PRIMARY KEY, NOT NULL
* title: VARCHAR, NOT NULL,
* issuance date: DATE
* language: VARCHAR
* pages: NUMBER
* stakeholders: VARCHAR
* scale: VARCHAR (could be a number, but blueprints and text docs do not report scales, so we might keep it a generic varchar)
* description: VARCHAR
* type: ENUM(Informative doc, prescriptive doc, design doc, technical doc, material effect)
* coordinates: VARCHAR (or db native geo coordinates depending on implementation, or set of coordinates to "enclose" a sub area)
* last_modified_by: VARCHAR NOT NULL REFERENCES users(username) \*\*

\* "serial" is postgres syntax for auto incrementing integer
\*\* probably not necessary to have this relationship

---

# DOCUMENT LINKS

* link_id: SERIAL, PRIMARY KEY \*
* doc_id1 NUMBER NOT NULL REFERENCES documents(id) ON DELETE CASCADE
* doc_id2 NUMBER NOT NULL REFERENCES documents(id) ON DELETE CASCADE
* link_type ENUM(direct, collateral, projection, update)
* created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

if we want to prevent duplicate links with the same type of connections with the same documents, we also add
CREATE UNIQUE INDEX idx_unique_links ON document_links (document_id1, document_id2, link_type);

\* having doc_id1 and doc_id2 together as primary keys is not enough because two documents could be linked together multiple times, so reusing (doc_id1, doc_id2) would violate the unique constraint needed for the key

---

# FILES

* id SERIAL PRIMARY KEY,
* file_url VARCHAR(255) NOT NULL \*
* uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

\* External storage URL or path of a folder in the backend

each row represents a single file

---

# DOCUMENT_FILES

* doc_id: NUMBER REFERENCES documents(id) ON DELETE CASCADE,
* file_id: NUMBER REFERENCES files(id) ON DELETE CASCADE
* role: ENUM(original resource, attachment)
* PRIMARY KEY (document_id, file_id)

models n to n relationship between docs and files, also specifies the type of relationship (original resource or attachment)