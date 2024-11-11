import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Update 'users' table
  // Set default value and update existing NULLs
  await knex('users')
    .whereNull('type')
    .update({ type: 'resident' });

  // Set the 'type' column to NOT NULL
  await knex.raw('ALTER TABLE "users" ALTER COLUMN "type" SET NOT NULL');

  // Update 'documents' table
  await knex('documents')
    .whereNull('type')
    .update({ type: 'informative_doc' });

  // Set the 'type' column to NOT NULL
  await knex.raw('ALTER TABLE "documents" ALTER COLUMN "type" SET NOT NULL');

  // Update 'document_files' table
  await knex('document_files')
    .whereNull('role')
    .update({ role: 'attachment' });

  // Set the 'role' column to NOT NULL
  await knex.raw('ALTER TABLE "document_files" ALTER COLUMN "role" SET NOT NULL');
}

export async function down(knex: Knex): Promise<void> {
  // Revert 'users' table
  await knex.raw('ALTER TABLE "users" ALTER COLUMN "type" DROP NOT NULL');

  // Revert 'documents' table
  await knex.raw('ALTER TABLE "documents" ALTER COLUMN "type" DROP NOT NULL');

  // Revert 'document_files' table
  await knex.raw('ALTER TABLE "document_files" ALTER COLUMN "role" DROP NOT NULL');
}