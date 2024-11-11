import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('document_links', (table) => {
    table.unique(['doc_id1', 'doc_id2', 'link_type'], 'document_links_docid1_docid2_linktype_unique');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('document_links', (table) => {
    table.dropUnique(['doc_id1', 'doc_id2', 'link_type'], 'document_links_docid1_docid2_linktype_unique');
  });
}