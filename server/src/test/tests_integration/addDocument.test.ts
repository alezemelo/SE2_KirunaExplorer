import { describe, beforeEach, beforeAll, afterAll, test, expect } from "@jest/globals";
import request from 'supertest';

import { app, server } from '../../../index';
import dbpg from '../../db/temp_db';
import {Document, DocumentType} from '../../models/document';

import DocumentController from '../../rcd/controllers/documentController';
import DocumentDAO from "../../rcd/daos/documentDAO";
import { DocumentNotFoundError } from '../../errors/documentErrors';

import temp_emptyDB from "../../db/temp_db_empty";
import temp_populateDB from "../../db/temp_db_population";
import dayjs from "dayjs";


describe('add document test', () => {
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

  describe('dao tests', () => {
    test('ok ', async() => {
        const doc = new Document(
            25,
            "new doc",
            DocumentType.design_doc,
            "admin",
            dayjs('2022-01-01'),
            "english",
            222,
            "aaa",
            "asvahvagsg"
        )
        await temp_populateDB();
        const res = await documentDAO.addDocument(doc);
        console.log(res);

    })
  })

})




