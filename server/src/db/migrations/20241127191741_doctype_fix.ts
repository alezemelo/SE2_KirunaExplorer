import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTable('doctypes', (table) => {
        table.string('name').notNullable().primary();
    })
    .alterTable('documents', (table) => {
        table.foreign('type')
            .references('name')
            .inTable('doctypes')
            .onDelete('RESTRICT') // doctype cannot be deleted if an existing document uses it
            .onUpdate('CASCADE') //if doctype name changes, then update all documents that use it
    });
}


// reverts changes in up
export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('documents', (table) => {
        table.dropForeign('type');  // Drop the foreign key constraint on 'type' column
    })
    .dropTableIfExists('doctypes');
}

