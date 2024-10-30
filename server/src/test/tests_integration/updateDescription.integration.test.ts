import { app } from '../../../index';
import { describe, beforeEach, beforeAll, afterAll, test, expect } from "@jest/globals";
import DocumentController from '../../rcd/controllers/documentController';
import request from 'supertest';
import { DocumentNotFoundError } from '../../errors/documentErrors';

describe('update_description Integration Tests', () => {
  let documentDAO: DocumentDao;
  let documentController: DocumentController;

  beforeAll(async () => {
    // Initialize test structures
    documentDAO = new DocumentDao();
    documentController = new DocumentController();

    // TODO Empty the db
  });

  afterAll(async () => {
    // TODO Empty the db
    // TODO maybe close the db connection but maybe it's bad
  });

  beforeEach(async () => {
    // TODO Empty the db
  });

  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('DAO Tests', () => {
    test('OK successful update', async () => {
      // TODO Insert a document with a description
      // TODO Update the description of the document
      // TODO Check that the description was updated
    });

    test('OK successful update with empty description', async () => {
      // TODO Insert a document without a description
      // TODO Update the description 
      // TODO Check that the description was updated
    });

    test('ERROR document not found', async () => {
      // TODO Update the description of a non-existing document
      // TODO Check that the DocumentNotFoundError was thrown
    });

    // idk if this is possible, if so the db has problems
    test('ERROR multiple documents updated', async () => {
      // TODO Insert two documents with the same id
      // TODO Update the description of the document
      // TODO Check that an error was thrown (containing "More than one document was updated")
    });
  });

  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('Controller Tests', () => {
    test('OK successful update', async () => {
      // TODO Insert a document with a description
      documentController.updateDescription(1, "new description");
      // TODO fetch document with id 1 and check if the description is "new description"
    });

    test('OK successful update with empty description', async () => {
      // TODO Insert a document without a description
      documentController.updateDescription(1, "new description");
      // TODO fetch document with id 1 and check if the description is "new description"
    });

    test('ERROR document not found', async () => {
      await expect(documentController.updateDescription(1, "new description"))
        .rejects
        .toThrow(DocumentNotFoundError);
    });

    // AGAIN idk if this is possible, if so the db has problems
    test('ERROR multiple documents updated', async () => {
      // TODO Insert two documents with the same id
      await expect(documentController.updateDescription(1, "new description"))
        .rejects.toThrow("More than one document was updated");
    });
  });

  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('Route Tests', () => {
    test('OK successful update', async () => {
      // TODO Insert a document with a description
      // TODO login as Urban Planner
      const res = request(app).post('/kiruna_explorer/documents/1')
        .send({ description: "new description" });
      expect(res.status).toBe(200);      
    });

    test('OK successful update with empty description', async () => {
      // TODO Insert a document without a description
      // TODO login as Urban Planner
      const res = request(app).post('/kiruna_explorer/documents/1')
        .send({ description: "new description" });
      expect(res.status).toBe(200);
    });

    test('ERROR document not found', async () => {
      // TODO login as Urban Planner
      const res = request(app).post('/kiruna_explorer/documents/1')
        .send({ description: "new description" });
      expect(res.status).toBe(404);
    });

    test('ERROR - Format: invalid id', async () => {
      // TODO login as Urban Planner
      const res = request(app).post('/kiruna_explorer/documents/abc')
        .send({ description: "new description" });
      expect(res.status).toBe(422);
    });

    test('ERROR - Format: invalid description - it has more than 2k chars', async () => {
      // TODO login as Urban Planner
      const more_than_2000_chars = "a".repeat(2001);
      const res = request(app).post(`/kiruna_explorer/documents/1`)
        .send({ description: more_than_2000_chars });
      expect(res.status).toBe(422);
    });

    test('ERRROR - generic', async () => {
      // close db connection
      // TODO login as Urban Planner
      const res = request(app).post('/kiruna_explorer/documents/1')
        .send({ description: "new description" });
      expect(res.status).toBe(500);
    });

    test('ERROR - Unauthenticated', async () => {
      const res = request(app).post('/kiruna_explorer/documents/1')
        .send({ description: "new description" });
      expect(res.status).toBe(401);
    });
  });
});