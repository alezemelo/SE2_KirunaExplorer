const { dbPopulate, dbEmpty, dbRead, dbUpdate } = require('./db_common_operations');
const knex = require('./db').default;

describe('DB Common Operations', () => {
  
  beforeAll(async () => {
    await knex.migrate.latest(); // Ensure the latest migrations are applied
  });

  afterAll(async () => {
    await dbEmpty();
    await knex.destroy(); // Close the Knex connection after tests
  });

  beforeEach(async () => {
    await dbEmpty(); // Clear the database before each test
    await dbPopulate(); // Populate the database with sample data
    // await knex('documents').where({ last_modified_by: 'user1' }).del();
});



  it('should populate the database with sample data', async () => {
    // await dbPopulate();

    const users = await knex('users').select();
    expect(users).toHaveLength(2); // Verify two users were inserted

    const documents = await knex('documents').select();
    expect(documents).toHaveLength(2); // Verify two documents were inserted

    const documentLinks = await knex('document_links').select();
    expect(documentLinks).toHaveLength(1); // Verify one document link was inserted
});

    it('should read data from the database', async () => {
      // await dbPopulate();
      const result = await dbRead();
      expect(result).toBeDefined(); // Ensure the read function returns data
      expect(result.users.length).toBeGreaterThan(0);
      expect(result.documents.length).toBeGreaterThan(0);
    });

    it('should update a record in the database', async () => {
      await dbUpdate('users', { username: 'user1' }, { type: 'urban_planner' });
      const updatedUser = await knex('users').where({ username: 'user1' }).first();
      expect(updatedUser.type).toBe('urban_planner');
  });


  it('should empty the database', async () => {
      await dbEmpty();
      const users = await knex('users').select();
      const documents = await knex('documents').select();
      const documentLinks = await knex('document_links').select();
      expect(users).toHaveLength(0);
      expect(documents).toHaveLength(0);
      expect(documentLinks).toHaveLength(0);
      });
});