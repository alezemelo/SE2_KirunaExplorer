import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    // creates new stakeholders table
    await knex.schema.createTable('stakeholders', (table) => {
        table.string('name').notNullable().primary();
    })
    // creates join table for stakeholders and docs
    .createTable('document_stakeholders', (table) => {
        table.integer('doc_id').notNullable();
        table.string('stakeholder_id').notNullable();
        table.foreign('doc_id').references('id').inTable('documents').onDelete('CASCADE');
        table.foreign('stakeholder_id').references('name').inTable('stakeholders').onDelete('CASCADE');
        table.primary(['doc_id', 'stakeholder_id']); // primary key is a combination of the two
    })
    // drops the stakeholders field
    .alterTable('documents', (table) => {
        table.dropColumn('stakeholders');
    });

}


// reverts changes in up
export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('documents', (table) => {
            table.string('stakeholders');
        })
        .dropTableIfExists('document_stakeholders')
        .dropTableIfExists('stakeholders');
}

