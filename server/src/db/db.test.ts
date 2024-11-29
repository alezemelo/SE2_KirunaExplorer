import knexConfig from './knexfile';
const knex = require('./db').default;
import { dbEmpty } from './db_common_operations';

beforeAll(async () => {
  await knex.migrate.latest(); // Ensure the latest migrations are applied

  // Insert a test user to satisfy foreign key constraint in documents
  await knex('users').insert({
    username: 'test_user',
    hash: 'test_hash',
    salt: 'test_salt',
    type: 'urban_planner',
  });
});

afterAll(async () => {
  await dbEmpty();
  await knex.destroy();
});

beforeEach(async () => {
  // Using raw SQL to truncate tables with cascading to avoid foreign key constraint issues
  await knex.raw(`
    TRUNCATE TABLE document_files RESTART IDENTITY CASCADE;
    TRUNCATE TABLE document_links RESTART IDENTITY CASCADE;
    TRUNCATE TABLE files RESTART IDENTITY CASCADE;
    TRUNCATE TABLE documents RESTART IDENTITY CASCADE;
    TRUNCATE TABLE users RESTART IDENTITY CASCADE;
  `);

  // Re-insert the test user after truncation
  await insertTestUser();
});

// Helper functions
const insertTestUser = async () => {
  await knex('users').insert({
    username: 'test_user',
    hash: 'test_hash',
    salt: 'test_salt',
    type: 'urban_planner',
  });
};

const insertSampleDocument = async (title: string = 'Sample Document') => {
  await knex('documents').insert({
    title,
    issuance_date: new Date(),
    language: 'English',
    pages: 10,
    //stakeholders: 'Stakeholder A',
    scale: '1:1000',
    description: 'A test document',
    type: 'informative_doc',
    last_modified_by: 'test_user',
  });
  const document = await knex('documents').orderBy('id', 'desc').first();
  return document.id;
};

const insertSampleDocumentLink = async (docId1: number, docId2: number, linkType: string = 'direct') => {
  await knex('document_links').insert({
    doc_id1: docId1,
    doc_id2: docId2,
    link_type: linkType,
  });
  const documentLink = await knex('document_links').orderBy('link_id', 'desc').first();
  return documentLink.link_id;
};

// New helper to insert a sample file and return its ID
const insertSampleFile = async (fileUrl: string = 'https://example.com/file.pdf') => {
  await knex('files').insert({
    file_url: fileUrl,
    file_name: 'file1.pdf',
  });
  const file = await knex('files').orderBy('id', 'desc').first();
  return file.id;
};

describe("db test (CRUD methods and things)", () => {
    // Users CRUD Tests
    describe('Users CRUD operations', () => {
      it('should create a new user', async () => {
        await knex('users').insert({
          username: 'new_user',
          hash: 'hash_value',
          salt: 'salt_value',
          type: 'resident',
        });
    
        const user = await knex('users').where({ username: 'new_user' }).first();
        expect(user).toHaveProperty('username', 'new_user');
      });
    
      it('should read a user by username', async () => {
        const user = await knex('users').where({ username: 'test_user' }).first();
        expect(user).not.toBeNull();
        expect(user).toHaveProperty('username', 'test_user');
      });
    
      it('should update a user type', async () => {
        await knex('users').where({ username: 'test_user' }).update({ type: 'urban_developer' });
        const updatedUser = await knex('users').where({ username: 'test_user' }).first();
        expect(updatedUser).toHaveProperty('type', 'urban_developer');
      });
    
      it('should delete a user', async () => {
        await knex('users').where({ username: 'test_user' }).del();
        const deletedUser = await knex('users').where({ username: 'test_user' }).first();
        expect(deletedUser).toBeUndefined();
      });
    });
    
    // Documents CRUD Tests
    describe('Documents CRUD operations', () => {
      it('should create a new document', async () => {
        const docId = await insertSampleDocument();
    
        const document = await knex('documents').where({ id: docId }).first();
        expect(document).toHaveProperty('title', 'Sample Document');
      });
    
      it('should read a document by ID', async () => {
        const docId = await insertSampleDocument();
    
        const document = await knex('documents').where({ id: docId }).first();
        expect(document).not.toBeNull();
        expect(document).toHaveProperty('title', 'Sample Document');
      });
    
      it('should update a document', async () => {
        const docId = await insertSampleDocument();
    
        await knex('documents').where({ id: docId }).update({ title: 'Updated Document' });
        const updatedDocument = await knex('documents').where({ id: docId }).first();
        expect(updatedDocument).toHaveProperty('title', 'Updated Document');
      });
    
      it('should delete a document', async () => {
        const docId = await insertSampleDocument();
    
        await knex('documents').where({ id: docId }).del();
        const deletedDocument = await knex('documents').where({ id: docId }).first();
        expect(deletedDocument).toBeUndefined();
      });
    });
    
    // Document Links CRUD Tests
    describe('Document Links CRUD operations', () => {
      it('should create a new document link', async () => {
        const docId1 = await insertSampleDocument('Document 1');
        const docId2 = await insertSampleDocument('Document 2');
    
        const linkId = await insertSampleDocumentLink(docId1, docId2);
    
        const documentLink = await knex('document_links').where({ link_id: linkId }).first();
        expect(documentLink).toHaveProperty('doc_id1', docId1);
        expect(documentLink).toHaveProperty('doc_id2', docId2);
        expect(documentLink).toHaveProperty('link_type', 'direct');
      });
    
      it('should read a document link by ID', async () => {
        const docId1 = await insertSampleDocument('Document 1');
        const docId2 = await insertSampleDocument('Document 2');
    
        const linkId = await insertSampleDocumentLink(docId1, docId2);
    
        const documentLink = await knex('document_links').where({ link_id: linkId }).first();
        expect(documentLink).not.toBeNull();
        expect(documentLink).toHaveProperty('link_id', linkId);
      });
    
      it('should update a document link type', async () => {
        const docId1 = await insertSampleDocument('Document 1');
        const docId2 = await insertSampleDocument('Document 2');
    
        const linkId = await insertSampleDocumentLink(docId1, docId2);
    
        await knex('document_links').where({ link_id: linkId }).update({ link_type: 'collateral' });
        const updatedDocumentLink = await knex('document_links').where({ link_id: linkId }).first();
        expect(updatedDocumentLink).toHaveProperty('link_type', 'collateral');
      });
    
      it('should delete a document link', async () => {
        const docId1 = await insertSampleDocument('Document 1');
        const docId2 = await insertSampleDocument('Document 2');
    
        const linkId = await insertSampleDocumentLink(docId1, docId2);
    
        await knex('document_links').where({ link_id: linkId }).del();
        const deletedDocumentLink = await knex('document_links').where({ link_id: linkId }).first();
        expect(deletedDocumentLink).toBeUndefined();
      });
    });

  // Files CRUD Tests
  describe('Files CRUD operations', () => {
    it('should create a new file', async () => {
      const fileId = await insertSampleFile();
      const file = await knex('files').where({ id: fileId }).first();
      expect(file).toHaveProperty('file_url', 'https://example.com/file.pdf');
    });

    it('should read a file by ID', async () => {
      const fileId = await insertSampleFile();
      const file = await knex('files').where({ id: fileId }).first();
      expect(file).not.toBeNull();
      expect(file).toHaveProperty('file_url', 'https://example.com/file.pdf');
    });

    it('should update a file URL', async () => {
      const fileId = await insertSampleFile();
      await knex('files').where({ id: fileId }).update({ file_url: 'https://example.com/updated-file.pdf' });
      const updatedFile = await knex('files').where({ id: fileId }).first();
      expect(updatedFile).toHaveProperty('file_url', 'https://example.com/updated-file.pdf');
    });

    it('should delete a file', async () => {
      const fileId = await insertSampleFile();
      await knex('files').where({ id: fileId }).del();
      const deletedFile = await knex('files').where({ id: fileId }).first();
      expect(deletedFile).toBeUndefined();
    });
  });

  // Document Files Association Tests
  describe('Document Files Association operations', () => {
    it('should associate a file with a document', async () => {
      const docId = await insertSampleDocument();
      const fileId = await insertSampleFile();

      await knex('document_files').insert({
        doc_id: docId,
        file_id: fileId,
        role: 'original_resource',
      });

      const docFile = await knex('document_files').where({ doc_id: docId, file_id: fileId }).first();
      expect(docFile).toHaveProperty('role', 'original_resource');
    });

    it('should read a document-file association by document and file IDs', async () => {
      const docId = await insertSampleDocument();
      const fileId = await insertSampleFile();

      await knex('document_files').insert({
        doc_id: docId,
        file_id: fileId,
        role: 'attachment',
      });

      const docFile = await knex('document_files').where({ doc_id: docId, file_id: fileId }).first();
      expect(docFile).not.toBeNull();
      expect(docFile).toHaveProperty('role', 'attachment');
    });

    it('should update the role of a document-file association', async () => {
      const docId = await insertSampleDocument();
      const fileId = await insertSampleFile();

      await knex('document_files').insert({
        doc_id: docId,
        file_id: fileId,
        role: 'original_resource',
      });

      await knex('document_files').where({ doc_id: docId, file_id: fileId }).update({ role: 'attachment' });
      const updatedDocFile = await knex('document_files').where({ doc_id: docId, file_id: fileId }).first();
      expect(updatedDocFile).toHaveProperty('role', 'attachment');
    });

    it('should delete a document-file association', async () => {
      const docId = await insertSampleDocument();
      const fileId = await insertSampleFile();

      await knex('document_files').insert({
        doc_id: docId,
        file_id: fileId,
        role: 'original_resource',
      });

      await knex('document_files').where({ doc_id: docId, file_id: fileId }).del();
      const deletedDocFile = await knex('document_files').where({ doc_id: docId, file_id: fileId }).first();
      expect(deletedDocFile).toBeUndefined();
    });
  });
});
