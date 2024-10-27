import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema
        .createTable('users', (table) => {
            table.string('username').notNullable().primary();
            table.string('hash').notNullable();
            table.string('salt').notNullable();
            table.enu('type', ['resident', 'urban_planner', 'urban_developer']);
        })
        .createTable('documents', (table) => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.date('issuance_date');
            table.string('language');
            table.integer('pages');
            table.string('stakeholders');
            table.string('scale');
            table.string('description');
            table.enu('type', ['informative_doc', 'prescriptive_doc', 'design_doc', 'technical_doc', 'material_effect']);
            table.geography('coordinates');
            table.string('last_modified_by').notNullable().references('username').inTable('users');
        })
        .createTable('document_links', (table) => {
            table.increments('link_id').primary();
            table.integer('doc_id1').notNullable().references('id').inTable('documents');
            table.integer('doc_id2').notNullable().references('id').inTable('documents');
            table.enu('link_type', ['original_resource', 'attachment']);
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
        .createTable('files', (table) => {
            table.increments('id').primary();
            table.string('file_url').notNullable();
            table.timestamp('uploaded_at').defaultTo(knex.fn.now());
        })
        .createTable('document_files', (table) => {
            table.integer('doc_id').notNullable().references('id').inTable('documents').onDelete('CASCADE');
            table.integer('file_id').notNullable().references('id').inTable('files').onDelete('CASCADE');
            table.enu('role', ['original_resource', 'attachment']);
            table.primary(['doc_id', 'file_id']);
        });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema
        .dropSchemaIfExists('users')
        .dropTableIfExists('documents')
        .dropTableIfExists('document_links')
        .dropTableIfExists('files')
        .dropTableIfExists('document_files');
}

