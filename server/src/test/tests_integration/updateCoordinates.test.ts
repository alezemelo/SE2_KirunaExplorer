import { describe, beforeEach, beforeAll, afterAll, test, expect } from "@jest/globals";
import request from 'supertest';

import { app, server } from '../../../index';
import dbpg from '../../db/temp_db';
import {Document} from '../../models/document';

import DocumentController, { Coordinates } from '../../rcd/controllers/documentController';
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

  const coord:Coordinates = {lat: 55.22, lng: 55.232323} 

  describe('dao test', () => {
    test('ok', async () => {
        await temp_populateDB();
        const res = await documentDAO.updateCoordinates(15, coord);
        expect(res).toBe(1);
    })
    test('document does not exist', async () => {
        await temp_populateDB();
        const res = await documentDAO.updateCoordinates(1500, coord);
        expect(res).toBe(0);
    })
  })
  /*describe('controller test', () => {
    test('document does not exist', async () => {
        await temp_populateDB();
        expect(await documentController.updateCoordinates(1005, coord)).rejects;
    })
  })*/
  describe('route test', () => {
    test('ok', async () => {
        await temp_populateDB();
        const res = await request(app).patch('/kiruna_explorer/documents/15/coordinates')
        .send({ lat: 55.2222, lng: 2222 });
        expect(res.status).toBe(200);
    })
    test('invalid input lat', async () => {
        await temp_populateDB();
        const res = await request(app).patch('/kiruna_explorer/documents/15/coordinates')
        .send({ lat: "55.2222", lng: "2222" });
        const doc = await documentDAO.getDocument(15)
        console.log(doc)
    })
  })

});