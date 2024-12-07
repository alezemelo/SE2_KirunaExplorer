import type { Knex } from "knex";

const CREATE_FULLTEXT_COLUMN = 'ALTER TABLE documents ADD COLUMN search_vector TSVECTOR;';
const FILL_FULLTEXT_COLUMN = "UPDATE documents SET search_vector = to_tsvector('english', title || ' ' || description);"
const CREATE_UPDATE_TRIGGER = "CREATE FUNCTION update_search_vector() RETURNS TRIGGER AS $$ "+
"BEGIN " +
    "NEW.search_vector := to_tsvector('english', NEW.title || ' ' || NEW.description); " +
    "RETURN NEW; " +
"END; " +
"$$ LANGUAGE plpgsql;";
const ADD_TRIGGER = "CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_search_vector();";
const CREATE_INDEX = "CREATE INDEX search_vec_idx ON documents USING GIN(search_vector);";

const DROP_INDEX = "DROP INDEX IF EXISTS search_vec_idx;";
const DROP_TRIGGER = "DROP TRIGGER IF EXISTS tsvectorupdate ON documents;";
const DROP_FUNCTION = "DROP FUNCTION IF EXISTS update_search_vector;";
const DROP_COLUMN = "ALTER TABLE documents DROP COLUMN IF EXISTS search_vector;";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(CREATE_FULLTEXT_COLUMN);
    await knex.raw(FILL_FULLTEXT_COLUMN);
    await knex.raw(CREATE_UPDATE_TRIGGER);
    await knex.raw(ADD_TRIGGER);
    await knex.raw(CREATE_INDEX);
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(DROP_INDEX);
    await knex.raw(DROP_TRIGGER);
    await knex.raw(DROP_FUNCTION);
    await knex.raw(DROP_COLUMN);
}

