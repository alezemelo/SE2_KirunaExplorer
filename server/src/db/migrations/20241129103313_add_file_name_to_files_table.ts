import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('files', (table) => {
        table.string('file_name').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('files', (table) => {
        table.dropColumn('file_name');
    });
}