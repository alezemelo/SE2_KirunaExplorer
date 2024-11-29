import { describe, beforeEach, beforeAll, afterAll, test, expect } from "@jest/globals";
import request from 'supertest';

import { app, server } from '../../../index';
import pgdb from '../../db/temp_db';
import { Document, DocumentType} from '../../models/document';

import DocumentController from '../../rcd/controllers/documentController';
import DocumentDAO from "../../rcd/daos/documentDAO";
import { DocumentNotFoundError } from '../../errors/documentErrors';

import { dbEmpty, dbPopulateActualData } from '../../db/db_common_operations';
import { populate } from '../populate_for_some_tests';
import db from '../../db/db';
import { Coordinates, CoordinatesAsPoint, CoordinatesAsPolygon, CoordinatesType } from "../../models/coordinates";
import dayjs from "dayjs";

/*
const complete_doc = new Document(
  15, // ID
  "Compilation of responses “So what the people of Kiruna think?” (15)", // Title
  DocumentType.informative_doc, // Type
  "admin", // Last modified by

  dayjs.utc("2005"), // Issuance date
  "Swedish", // Language
  999, // Pages
  "Kiruna kommun/Residents", // Stakeholders
  "Text", // Scale
  `This document is a compilation of the responses to ` +
      `the survey 'What is your impression of Kiruna?' ` +
      `From the citizens' responses to this last part of the ` +
      `survey, it is evident that certain buildings, such as ` +
      `the Kiruna Church, the Hjalmar Lundbohmsgården, ` +
      `and the Town Hall, are considered of significant ` +
      `value to the population. The municipality views the ` +
      `experience of this survey positively, to the extent ` +
      `that over the years it will propose various consultation opportunities`, // Description
  new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(20, 20)) // Coordinates
);
*/

const complete_doc = new Document(
  99, // ID
  "Sample test doc", // Title
  DocumentType.informative_doc, // Type
  "admin", // Last modified by

  dayjs.utc('2005').toISOString(), // Issuance date
  "Swedish", // Language
  999, // Pages
  ["Kiruna kommun", "Residents"], // Stakeholders
  "Text", // Scale
  "This is a sample test doc",
  new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(20, 20)) // Coordinates
);

const minimal_doc = new Document(
  99, // ID
  "Sample test doc", // Title
  DocumentType.informative_doc, // Type
  "admin", // Last modified by
  dayjs.utc('2005').toISOString(), // Issuance date
);

/*
const minimal_doc = new Document(
  15, // ID
  "Compilation of responses “So what the people of Kiruna think?” (15)", // Title
  DocumentType.informative_doc, // Type
  "admin", // Last modified by
);
*/

async function insertAdmin() {
  await db("users").insert({ username: "admin", hash: "hash", salt: "salt", type: "urban_planner" });
}

describe('get_document Integration Tests', () => {
  let documentDAO: DocumentDAO;
  let documentController: DocumentController;

  beforeAll(async () => {
    // Initialize test structures
    documentDAO = new DocumentDAO();
    documentController = new DocumentController();

    // TODO Empty the db
    //await dbEmpty();
    //await populate();
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
      test('OK document found', async () => {
        // Setting data
        await dbEmpty();
        await insertAdmin();
        await db("documents").insert(minimal_doc.toObjectWithoutStakeholders());

        // Running test target function(s)
        let response = await documentDAO.getDocument(99);

        // Checking results
        expect(response).not.toBeNull();
        if (response) {
          expect(response).toBeInstanceOf(Document);
          expect(response.id).toBe(99);
          expect(response.title).toBe("Sample test doc");
          expect(response.type).toBe(`informative_doc`);
          expect(response.lastModifiedBy).toBe(`admin`);
          expect(response.issuanceDate).toBe(`2005-01-01T00:00:00.000Z`);
          expect(response.language).toBeUndefined();
          expect(response.pages).toBeUndefined();
          expect(response.scale).toBeUndefined();
          expect(response.description).toBeUndefined();
          
          const coordinates = response.getCoordinates();
          expect(coordinates).not.toBeUndefined();
          expect(coordinates).not.toBeNull();
          if (coordinates) {
            expect(coordinates).toBeInstanceOf(Coordinates);
            expect(coordinates.getType()).toBe(`MUNICIPALITY`);
            expect(coordinates.getCoords()).toBeNull();
          }
        }
      });

      test('OK document with Point coordinates found', async () => {
        // Setting data
        await dbEmpty();
        await insertAdmin();
        await db("documents").insert(complete_doc.toObjectWithoutStakeholders());

        // Running test target function(s)
        const response = await documentDAO.getDocument(99);

        // Checking results
        expect(response).not.toBeNull();
        if (response) {
          expect(response).toBeInstanceOf(Document);
          expect(response.id).toBe(99);
          expect(response.title).toBe(`Sample test doc`);
          expect(response.type).toBe(`informative_doc`);
          expect(response.lastModifiedBy).toBe(`admin`);
          expect(response.issuanceDate).toBe(`2005-01-01T00:00:00.000Z`);
          expect(response.language).toBe(`Swedish`);
          expect(response.pages).toBe(999);
          expect(response.scale).toBe(`Text`);
          expect(response.description).toContain(`This is a sample test doc`);
          
          const coordinates = response.getCoordinates();
          expect(coordinates).not.toBeUndefined();
          expect(coordinates).not.toBeNull();
          if (coordinates) {
            expect(coordinates).toBeInstanceOf(Coordinates);
            expect(coordinates.getType()).toBe(`POINT`);
            const coords = coordinates.getCoords() as CoordinatesAsPoint;
            expect(coords).not.toBeUndefined();
            expect(coords).not.toBeNull();
            if (coords) {
              expect(coords).toBeInstanceOf(CoordinatesAsPoint);
              expect(coords.getLat()).toBe(20);
              expect(coords.getLng()).toBe(20);
            }
          }
        }
      });

      test('OK document with Polygon coordinates found', async () => {
        // Setting data
        await dbEmpty();
        await insertAdmin();
        const polygon = new CoordinatesAsPolygon([
            new CoordinatesAsPoint(20.123, 30.456),
            new CoordinatesAsPoint(40.789, 50.012),
            new CoordinatesAsPoint(60.345, 70.678),
            new CoordinatesAsPoint(20.123, 30.456),
        ]);


        let polygon_doc = complete_doc.copy();
        polygon_doc.setCoordinates(new Coordinates(CoordinatesType.POLYGON, polygon));
        await db("documents").insert(polygon_doc.toObjectWithoutStakeholders());

        // Running test target function(s)
        const response = await documentDAO.getDocument(99);

        // Checking results
        expect(response).not.toBeNull();
        if (response) {
          expect(response).toBeInstanceOf(Document);
          expect(response.id).toBe(99);
          expect(response.title).toBe(`Sample test doc`);
          expect(response.type).toBe(`informative_doc`);
          expect(response.lastModifiedBy).toBe(`admin`);
          expect(response.issuanceDate).toBe(`2005-01-01T00:00:00.000Z`);
          expect(response.language).toBe(`Swedish`);
          expect(response.pages).toBe(999);
          expect(response.scale).toBe(`Text`);
          expect(response.description).toContain(`This is a sample test doc`);
          
          const coordinates = response.getCoordinates();
          expect(coordinates).not.toBeUndefined();
          expect(coordinates).not.toBeNull();
          if (coordinates) {
            expect(coordinates).toBeInstanceOf(Coordinates);
            expect(coordinates.getType()).toBe(`POLYGON`);
            const coords = coordinates.getCoords() as CoordinatesAsPolygon;
            expect(coords).not.toBeUndefined();
            expect(coords).not.toBeNull();
            if (coords) {
              expect(coords).toBeInstanceOf(CoordinatesAsPolygon);
              expect(coords.getCoordinates()[0].getLat()).toBeCloseTo(20.123);
              expect(coords.getCoordinates()[0].getLng()).toBeCloseTo(30.456);
              expect(coords.getCoordinates()[1].getLat()).toBeCloseTo(40.789);
              expect(coords.getCoordinates()[1].getLng()).toBeCloseTo(50.012);
              expect(coords.getCoordinates()[2].getLat()).toBeCloseTo(60.345);
              expect(coords.getCoordinates()[2].getLng()).toBeCloseTo(70.678);
              expect(coords.getCoordinates()[3].getLat()).toBeCloseTo(20.123);
              expect(coords.getCoordinates()[3].getLng()).toBeCloseTo(30.456);
            }
          }
        }
      });

      test('OK document not found', async () => {
        // Running test target function(s)
        const response = await documentDAO.getDocument(99);

        // Checking results
        expect(response).toBeNull();
      });
  });

  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('Controller Tests', () => { 
    test('OK document found', async () => {
      // Setting data
      //await populate();

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
      expect(documentController.getDocument(99))
        .rejects
        .toThrow(DocumentNotFoundError);
    });
   });

  // ================================---------------+++++++++++++++++++++-----------------================================

  describe('Route Tests', () => { 
    test('OK document found', async () => {
      // Setting data
      //await populate();

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
      const response = await request(app).get('/kiruna_explorer/documents/99');

      // Checking results
      expect(response.status).toBe(404);
    });
   });
});