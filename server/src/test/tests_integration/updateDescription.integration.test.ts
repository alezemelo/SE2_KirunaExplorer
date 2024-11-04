import { describe, beforeEach, beforeAll, afterAll, test, expect } from "@jest/globals";
import request from 'supertest';

import { app, server } from '../../../index';
import dbpg from '../../db/temp_db';
import {Document} from '../../models/document';

import DocumentController from '../../rcd/controllers/documentController';
import DocumentDAO from "../../rcd/daos/documentDAO";
import { DocumentNotFoundError } from '../../errors/documentErrors';

import temp_emptyDB from "../../db/temp_db_empty";
import temp_populateDB from "../../db/temp_db_population";

describe('update_description Integration Tests', () => {
  let documentDAO: DocumentDAO;
  let documentController: DocumentController;

  beforeAll(async () => {
    // Initialize test structures
    documentDAO = new DocumentDAO();
    documentController = new DocumentController();

    // TODO Empty the db
    await temp_emptyDB();
    await temp_populateDB();
  });

  afterAll(async () => {
    await temp_emptyDB();

    await dbpg.disconnect();
    server.close();
  });

  beforeEach(async () => {
    await temp_emptyDB();
  });

  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('DAO Tests', () => {
    test('OK successful update', async () => {
      // Setting data
      await temp_populateDB();

      // Running test target function(s)
      const amt = await documentDAO.updateDescription(15, "new description");

      // Checking results
      expect(amt).toBe(1);

      const doc = await documentDAO.getDocument(15)
      expect(doc).not.toBeNull();
      if (doc) {      
        expect(doc).toBeInstanceOf(Document);
        expect(doc.description).toBe("new description");
      }
    });

    test('OK successful update with former empty description', async () => {
      // Setting data
      await temp_populateDB();
      await documentDAO.updateDescription(15, "");

      // Running test target function(s)
      const amt = await documentDAO.updateDescription(15, "new description");

      // Checking results
      expect(amt).toBe(1);

      const doc = await documentDAO.getDocument(15)
      expect(doc).not.toBeNull();
      if (doc) {      
        expect(doc).toBeInstanceOf(Document);
        expect(doc.description).toBe("new description");
      }
    });

    test('OK successful update emptying the description', async () => {
      // Setting data
      await temp_populateDB();

      // Running test target function(s)
      const amt = await documentDAO.updateDescription(15, "");

      // Checking results
      expect(amt).toBe(1);

      const doc = await documentDAO.getDocument(15)
      expect(doc).not.toBeNull();
      if (doc) {      
        expect(doc).toBeInstanceOf(Document);
        expect(doc.description).toBe("");
      }
    });

    test('ERROR document not found', async () => {
      // Setting data
      await temp_populateDB();

      // Running test target function(s)
      const amt = await documentDAO.updateDescription(1, "new description");

      // Checking results
      expect(amt).toBe(0);
    });
  });

  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('Controller Tests', () => {
    test('OK successful update', async () => {
      // Setting data
      await temp_populateDB();

      // Running test target function(s)
      await documentController.updateDescription(15, "new description");
      
      // Checking results
      const doc = await documentDAO.getDocument(15)
      expect(doc).not.toBeNull();
      if (doc) {      
        expect(doc).toBeInstanceOf(Document);
        expect(doc.description).toBe("new description");
      }
    });

    test('OK successful update with former empty description', async () => {
      // Setting data
      await temp_populateDB();
      await documentDAO.updateDescription(15, "");
      
      // Running test target function(s)
      await documentController.updateDescription(15, "new description");
      
      // Checking results
      const doc = await documentDAO.getDocument(15)
      expect(doc).not.toBeNull();
      if (doc) {      
        expect(doc).toBeInstanceOf(Document);
        expect(doc.description).toBe("new description");
      }
    });

    test('OK successful update emptying description', async () => {
      // Setting data
      await temp_populateDB();
      
      // Running test target function(s)
      await documentController.updateDescription(15, "");
      
      // Checking results
      const doc = await documentDAO.getDocument(15)
      expect(doc).not.toBeNull();
      if (doc) {      
        expect(doc).toBeInstanceOf(Document);
        expect(doc.description).toBe("");
      }
    });

    test('ERROR document not found', async () => {
      // Setting data
      await temp_populateDB();

      // Running test target function(s)
      await expect(documentController.updateDescription(1, "new description"))
      // Checking results
        .rejects
        .toThrow(DocumentNotFoundError);
    });
  });

  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('Route Tests', () => {
    test('OK successful update', async () => {
      // Setting data
      await temp_populateDB();
      // TODO login as Urban Planner

      // Running test target function
      const res = await request(app).post('/kiruna_explorer/documents/15/description')
        .send({ description: "new description" });

      // Checking results
      expect(res.status).toBe(200);

      const doc = await documentDAO.getDocument(15)
      expect(doc).not.toBeNull();
      if (doc) {      
        expect(doc).toBeInstanceOf(Document);
        expect(doc.description).toBe("new description");
      }
    });

    test('OK successful update with former empty description', async () => {
      // Setting data
      await temp_populateDB();
      await documentDAO.updateDescription(15, "");
      // TODO login as Urban Planner

      // Running test target function
      const res = await request(app).post('/kiruna_explorer/documents/15/description')
        .send({ description: "new description" });
        
      // Checking results
      expect(res.status).toBe(200);
      const doc = await documentDAO.getDocument(15)
      expect(doc).not.toBeNull();
      if (doc) {      
        expect(doc).toBeInstanceOf(Document);
        expect(doc.description).toBe("new description");
      }
    });

    test('OK successful update emptying description', async () => {
      // Setting data
      await temp_populateDB();
      // TODO login as Urban Planner

      // Running test target function
      const res = await request(app).post('/kiruna_explorer/documents/15/description')
        .send({ description: "" });
        
      // Checking results
      expect(res.status).toBe(200);
      const doc = await documentDAO.getDocument(15)
      expect(doc).not.toBeNull();
      if (doc) {      
        expect(doc).toBeInstanceOf(Document);
        expect(doc.description).toBe("");
      }
    });

    test('ERROR document not found', async () => {
      // Setting data
      // TODO login as Urban Planner

      // Running test target function
      const res = await request(app).post('/kiruna_explorer/documents/1/description')
        .send({ description: "new description" });

      // Checking results
      expect(res.status).toBe(404);
      // expect(res.body).toEqual({ message: "Document not found" });
    });

    test('ERROR - Format: invalid id', async () => {
      // Setting data
      // TODO login as Urban Planner

      // Running test target function
      const res = await request(app).post('/kiruna_explorer/documents/abc/description')
        .send({ description: "new description" });
      
      // Checking results
      expect(res.status).toBe(422);
    });

    test('ERROR - Format: invalid description - it has more than 2k chars', async () => {
      // Setting data
      // TODO login as Urban Planner
      const more_than_2000_chars = "a".repeat(2001);

      // Running test target function
      const res = await request(app).post(`/kiruna_explorer/documents/15/description`)
        .send({ description: more_than_2000_chars });

      // Checking results
      expect(res.status).toBe(422);
    });

    // // TODO when we have a function db
    // test('ERRROR - generic', async () => {
    //   // Setting data
    //   // TODO close db connection
    //   // TODO login as Urban Planner

    //   // Running test target function
    //   const res = await request(app).post('/kiruna_explorer/documents/15/description')
    //     .send({ description: "new description" });

    //   // Checking results
    //   expect(res.status).toBe(500);
    // });

    // // TODO when we have authentication
    // test('ERROR - Unauthenticated', async () => {
    //   // Setting data
    //   await temp_populateDB();

    //   // Running test target function
    //   const res = await request(app).post('/kiruna_explorer/documents/15/description')
    //     .send({ description: "new description" });

    //   expect(res.status).toBe(401);
    // });
  });
});