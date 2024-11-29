import { describe, beforeEach, beforeAll, afterAll, test, expect } from "@jest/globals";
import request from 'supertest';

import { app, server } from '../../../index';
import pgdb from '../../db/temp_db';
import {Document} from '../../models/document';

import DocumentController from '../../rcd/controllers/documentController';
import DocumentDAO from "../../rcd/daos/documentDAO";
import { DocumentNotFoundError } from '../../errors/documentErrors';

import { dbEmpty, dbPopulateActualData } from '../../db/db_common_operations';
import { populate } from '../populate_for_some_tests';
import db from '../../db/db';

import { URBAN_DEVELOPER, URBAN_PLANNER, RESIDENT, login } from "./test_utility";

describe('update_description Integration Tests', () => {
  let documentDAO: DocumentDAO;
  let documentController: DocumentController;

  beforeAll(async () => {
    // Initialize test structures
    documentDAO = new DocumentDAO();
    documentController = new DocumentController();
  });

  beforeEach(async () => {
    await dbEmpty();
    //await populate();
    await dbPopulateActualData();
  });

  afterAll(async () => {
    await dbEmpty();

    await pgdb.disconnect();
    server.close();
    await db.destroy();
  });
  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('DAO Tests', () => {
    it('OK successful update', async () => {
      // Setting data
      //await populate();;

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

    it('OK successful update with former empty description', async () => {
      // Setting data
      //await populate();;
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

    it('OK successful update emptying the description', async () => {
      // Setting data
      //await populate();;

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

    it('ERROR document not found', async () => {
      // Setting data
      //await populate();;

      // Running test target function(s)
      const amt = await documentDAO.updateDescription(1, "new description");

      // Checking results
      expect(amt).toBe(0);
    });
  });

  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('Controller Tests', () => {
    it('OK successful update', async () => {
      // Setting data
      //await populate();;

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

    it('OK successful update with former empty description', async () => {
      // Setting data
      //await populate();;
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

    it('OK successful update emptying description', async () => {
      // Setting data
      //await populate();;
      
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

    it('ERROR document not found', async () => {
      // Setting data
      //await populate();;

      // Running test target function(s)
      await expect(documentController.updateDescription(1, "new description"))
      // Checking results
        .rejects
        .toThrow(DocumentNotFoundError);
    });
  });

  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('Route Tests', () => {
    it('OK successful update', async () => {
      // Setting data
      //await populate();;
      // TODO login as Urban Planner
      const cookie = await login(URBAN_PLANNER);
      // Running test target function
      const res = await request(app).post('/kiruna_explorer/documents/15/description')
        .set("Cookie", cookie)
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

    it('OK successful update with former empty description', async () => {
      // Setting data
      //await populate();;
      await documentDAO.updateDescription(15, "");
      // TODO login as Urban Planner
      const cookie = await login(URBAN_PLANNER);
      // Running test target function
      const res = await request(app).post('/kiruna_explorer/documents/15/description')
        .set("Cookie", cookie)
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

    it('OK successful update emptying description', async () => {
      // Setting data
      //await populate();;
      // TODO login as Urban Planner
      const cookie = await login(URBAN_PLANNER);
      // Running test target function
      const res = await request(app).post('/kiruna_explorer/documents/15/description')
        .set("Cookie", cookie)
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

    it('ERROR document not found', async () => {
      // Setting data
      // TODO login as Urban Planner
      const cookie = await login(URBAN_PLANNER);
      // Running test target function
      const res = await request(app).post('/kiruna_explorer/documents/1/description')
        .set("Cookie", cookie)
        .send({ description: "new description" });

      // Checking results
      expect(res.status).toBe(404);
      // expect(res.body).toEqual({ message: "Document not found" });
    });

    it('ERROR - Format: invalid id', async () => {
      // Setting data
      // TODO login as Urban Planner
      const cookie = await login(URBAN_PLANNER);
      // Running test target function
      const res = await request(app).post('/kiruna_explorer/documents/abc/description')
        .set("Cookie", cookie)
        .send({ description: "new description" });
      
      // Checking results
      expect(res.status).toBe(422);
    });

    it('ERROR - Format: invalid description - it has more than 2.5k chars', async () => {
      // Setting data
      // TODO login as Urban Planner
      const cookie = await login(URBAN_PLANNER);
      const more_than_2000_chars = "a".repeat(2501);

      // Running test target function
      const res = await request(app).post(`/kiruna_explorer/documents/15/description`)
        .set("Cookie", cookie)
        .send({ description: more_than_2000_chars });

      // Checking results
      expect(res.status).toBe(422);
    });

    // // TODO when we have a function db
    // it('ERRROR - generic', async () => {
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
    // it('ERROR - Unauthenticated', async () => {
    //   // Setting data
    //   await populate();

    //   // Running test target function
    //   const res = await request(app).post('/kiruna_explorer/documents/15/description')
    //     .send({ description: "new description" });

    //   expect(res.status).toBe(401);
    // });
  });
});