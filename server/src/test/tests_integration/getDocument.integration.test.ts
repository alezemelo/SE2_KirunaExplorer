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
      test('OK document found', async () => {
        // Setting data
        await temp_populateDB();

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
      await temp_populateDB();

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
      await temp_populateDB();

      // Running test target function(s)
      const response = await request(app).get('/kiruna_explorer/documents/15');

      // Checking results
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(15);
      expect(response.body.description).toBe("This document is a compilation of the responses to the survey 'What is your impression of Kiruna?' From the citizens' responses to this last part of the survey, it is evident that certain buildings, such as the Kiruna Church, the Hjalmar Lundbohmsgården,");
    });

    test('ERROR document not found', async () => {
      // Running test target function(s)
      const response = await request(app).get('/kiruna_explorer/documents/15');

      // Checking results
      expect(response.status).toBe(404);
    });
   });
});