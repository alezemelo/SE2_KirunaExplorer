import type { Knex } from "knex";


// fixes the possible values in the link type column
export async function up(knex: Knex): Promise<void> {
    await knex.raw('ALTER TABLE document_links DROP COLUMN IF EXISTS link_type');

    await knex.schema.table("document_links", (table) => {
        table.enu("link_type", ["direct", "collateral", "projection", "update"]).notNullable();
    });
}


// reverts this change back
export async function down(knex: Knex): Promise<void> {
    await knex.raw('ALTER TABLE document_links DROP COLUMN IF EXISTS link_type');
    await knex.schema.table("document_links", (table) => {
        table.enu('link_type', ['original_resource', 'attachment']).notNullable();
    })
}

