import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasLinkType = await knex.schema.hasColumn('document_links', 'link_type');

  if (!hasLinkType) {
    await knex.schema.alterTable('document_links', (table) => {
      table.enu('link_type', ['direct', 'collateral', 'projection', 'update']).notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasLinkType = await knex.schema.hasColumn('document_links', 'link_type');

  if (hasLinkType) {
    await knex.schema.alterTable('document_links', (table) => {
      table.dropColumn('link_type');
    });
  }
}

