import { describe, beforeEach, beforeAll, afterAll, test, expect } from "@jest/globals";
import request from "supertest";

import { app, server } from "../../../index";
import pgdb from "../../db/temp_db";
import DocumentDAO from "../../rcd/daos/documentDAO";
import { dbEmpty } from "../../db/db_common_operations";
import { populate } from "../populate_for_some_tests";
import db from "../../db/db";
import { CoordinatesType } from "../../models/coordinates";

describe("PATCH /documents/:id/coordinates Route Tests", () => {
  let documentDAO: DocumentDAO;

  beforeAll(async () => {
    documentDAO = new DocumentDAO();
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

  describe("Route Tests", () => {
    it("OK - Update POINT coordinates successfully", async () => {
      // Setting data
      await populate();
      // TODO: Simulate user login as Urban Planner if authentication is implemented

      // Running test target function
      const res = await request(app)
        .patch("/kiruna_explorer/documents/15/coordinates")
        .send({
          type: CoordinatesType.POINT,
          coords: { lat: 67.85, lng: 20.22 },
        });

      // Checking results
      expect(res.status).toBe(200);

      const doc = await documentDAO.getDocument(15);
      expect(doc).not.toBeNull();
      if (doc) {
        expect(doc.coordinates.getType()).toBe(CoordinatesType.POINT);
        expect(doc.coordinates.getCoords()).toEqual({ lat: 67.85, lng: 20.22 });
      }
    });

    

    it("ERROR - Document not found", async () => {
      // Running test target function
      const res = await request(app)
        .patch("/kiruna_explorer/documents/9999/coordinates")
        .send({
          type: CoordinatesType.POINT,
          coords: { lat: 67.85, lng: 20.22 },
        });

      // Checking results
      expect(res.status).toBe(404);
    });
    

    it("ERROR - Invalid coordinates format", async () => {
      // Setting data
      await populate();
      // TODO: Simulate user login as Urban Planner if authentication is implemented

      // Running test target function
      const res = await request(app)
        .patch("/kiruna_explorer/documents/15/coordinates")
        .send({
          type: CoordinatesType.POINT,
          coords: { lat: "invalid", lng: "invalid" },
        });

      // Checking results
      expect(res.status).toBe(422);
    });

    it("ERROR - Invalid id format", async () => {
      // Running test target function
      const res = await request(app)
        .patch("/kiruna_explorer/documents/abc/coordinates")
        .send({
          type: CoordinatesType.POINT,
          coords: { lat: 67.85, lng: 20.22 },
        });

      // Checking results
      expect(res.status).toBe(422);
    });
  });
});
