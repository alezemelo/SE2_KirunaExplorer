import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('documents', (table) => {
        table.dropChecks('documents_type_check');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('documents', (table) => {
        table.check('type', ['informative_doc', 'prescriptive_doc', 'design_doc', 'technical_doc', 'material_effect']);
    });
}

