import type { Knex } from "knex";
import DateType from "../../models/date_types";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('documents', (table) => {
        table.enu('date_type', Object.values(DateType)).nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('documents', (table) => {
        table.dropColumn('date_type');
    });
}