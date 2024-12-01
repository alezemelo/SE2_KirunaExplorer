import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('scales', (table) => {
        table.string('value').notNullable().primary();
    })
    .alterTable('documents', (table) => {
        table.foreign('scale')
            .references('value')
            .inTable('scales')
            .onDelete('RESTRICT') // scale cannot be deleted if an existing document uses it
            .onUpdate('CASCADE') //if scale changes, then update all documents that use it
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('documents', (table) => {
        table.dropForeign('scale');  // Drop the foreign key constraint on 'scale' column
    })
    .dropTableIfExists('scales');
}

