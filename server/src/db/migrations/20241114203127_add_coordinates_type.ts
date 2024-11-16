import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('documents', (table) => {
        table.enu('coordinates_type', ['POINT', 'POLYGON', 'MUNICIPALITY']).notNullable().defaultTo('MUNICIPALITY');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('documents', (table) => {
        table.dropColumn('coordinates_type');
    });
}