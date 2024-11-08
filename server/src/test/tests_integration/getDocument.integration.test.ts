import { describe, beforeEach, beforeAll, afterAll, test, expect } from "@jest/globals";
import request from 'supertest';

import { app, server } from '../../../index';
import pgdb from '../../db/temp_db';
import {Document} from '../../models/document';

import DocumentController from '../../rcd/controllers/documentController';
import DocumentDAO from "../../rcd/daos/documentDAO";
import { DocumentNotFoundError } from '../../errors/documentErrors';

import { dbEmpty } from '../../db/db_common_operations';
import { populate } from '../populate_for_some_tests';
import db from '../../db/db';

describe('update_description Integration Tests', () => {
  let documentDAO: DocumentDAO;
  let documentController: DocumentController;

  beforeAll(async () => {
    // Initialize test structures
    documentDAO = new DocumentDAO();
    documentController = new DocumentController();

    // TODO Empty the db
    await dbEmpty();
    await populate();
  });

  afterAll(async () => {
    await dbEmpty();

    await pgdb.disconnect();
    server.close();
    await db.destroy();
  });

  beforeEach(async () => {
    await dbEmpty();
  });

  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('DAO Tests', () => {
      test('OK document found', async () => {
        // Setting data
        await dbEmpty();
        await populate();

        // Running test target function(s)
        const response = await documentDAO.getDocument(15);

        // Checking results
        expect(response).not.toBeNull();
        if (response) {
          expect(response).toBeInstanceOf(Document);
          expect(response.id).toBe(15);
        }
      });

      test('OK document not found', async () => {
        // Running test target function(s)
        const response = await documentDAO.getDocument(15);

        // Checking results
        expect(response).toBeNull();
      });
  });

  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('Controller Tests', () => { 
    test('OK document found', async () => {
      // Setting data
      await populate();

      // Running test target function(s)
      const response = await documentController.getDocument(15);

      // Checking results
      expect(response).not.toBeNull();
      if (response) {
        expect(response).toBeInstanceOf(Document);
        expect(response.id).toBe(15);
      }
    });

    test('ERROR document not found', async () => {
      // Running test target function(s)
      expect(documentController.getDocument(15))
        .rejects
        .toThrow(DocumentNotFoundError);
    });
   });

  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('Route Tests', () => { 
    test('OK document found', async () => {
      // Setting data
      await populate();

      // Running test target function(s)
      const response = await request(app).get('/kiruna_explorer/documents/15');

      // Checking results
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(15);
      expect(response.body.description).toBe(`This document is a compilation of the responses to ` +
    `the survey 'What is your impression of Kiruna?' ` +
    `From the citizens' responses to this last part of the ` +
    `survey, it is evident that certain buildings, such as ` +
    `the Kiruna Church, the Hjalmar Lundbohmsgården, ` +
    `and the Town Hall, are considered of significant ` +
    `value to the population. The municipality views the ` +
    `experience of this survey positively, to the extent ` +
    `that over the years it will propose various consultation opportunities`);
    });

    test('ERROR document not found', async () => {
      // Running test target function(s)
      const response = await request(app).get('/kiruna_explorer/documents/15');

      // Checking results
      expect(response.status).toBe(404);
    });
   });
});