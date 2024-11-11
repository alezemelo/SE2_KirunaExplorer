import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Drop existing foreign key constraints
  await knex.schema.alterTable('document_links', (table) => {
    table.dropForeign(['doc_id1']);
    table.dropForeign(['doc_id2']);
  });

  // Add new foreign key constraints with ON DELETE CASCADE
  await knex.schema.alterTable('document_links', (table) => {
    table.foreign('doc_id1').references('id').inTable('documents').onDelete('CASCADE');
    table.foreign('doc_id2').references('id').inTable('documents').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the foreign key constraints with ON DELETE CASCADE
  await knex.schema.alterTable('document_links', (table) => {
    table.dropForeign(['doc_id1']);
    table.dropForeign(['doc_id2']);
  });

  // Re-add the original foreign key constraints without ON DELETE CASCADE
  await knex.schema.alterTable('document_links', (table) => {
    table.foreign('doc_id1').references('id').inTable('documents');
    table.foreign('doc_id2').references('id').inTable('documents');
  });
}