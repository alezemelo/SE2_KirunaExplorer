import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.raw('ALTER TABLE documents ALTER COLUMN description TYPE VARCHAR(2500)');
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.raw('ALTER TABLE documents ALTER COLUMN description TYPE VARCHAR(255)');
}