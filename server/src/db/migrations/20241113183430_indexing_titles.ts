import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('documents', (table) => {
        table.index('title', 'documents_title_index');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('documents', (table) => {
        table.dropIndex('title', 'documents_title_index');
    });
}

