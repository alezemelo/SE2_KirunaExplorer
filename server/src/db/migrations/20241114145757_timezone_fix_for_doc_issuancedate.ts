import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('documents', (table) => {
        table.dropColumn('issuance_date');
    });

    await knex.schema.alterTable('documents', (table) => {
        table.timestamp('issuance_date');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('documents', (table) => {
        table.dropColumn('issuance_date');
    });

    await knex.schema.alterTable('documents', (table) => {
        table.date('issuance_date');
    });
}