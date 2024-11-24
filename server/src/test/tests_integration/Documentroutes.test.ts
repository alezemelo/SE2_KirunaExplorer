import { describe, beforeEach, beforeAll, afterAll, test, expect } from "@jest/globals";
import request from "supertest";

import { app, server } from "../../../index";
import pgdb from "../../db/temp_db";
import DocumentDAO from "../../rcd/daos/documentDAO";
import { dbEmpty } from "../../db/db_common_operations";
import { populate } from "../populate_for_some_tests";
import db from "../../db/db";
import { CoordinatesType } from "../../models/coordinates";

import { URBAN_DEVELOPER, URBAN_PLANNER, RESIDENT, login } from "./test_utility";
import { log } from "console";

describe("PATCH /documents/:id/coordinates Route Tests", () => {
  let documentDAO: DocumentDAO;

  beforeAll(async () => {
    documentDAO = new DocumentDAO();
  });

  beforeEach(async () => {
    await dbEmpty();
    await populate();
  });

  afterAll(async () => {
    await dbEmpty();
    await pgdb.disconnect();
    server.close();
    await db.destroy();
  });

 

  describe("Route Tests", () => {
    it("OK - Update POINT coordinates successfully", async () => {
      // Setting data
      //await populate();
      const cookie = await login(URBAN_PLANNER);

      // Running test target function
      const res = await request(app)
        .patch("/kiruna_explorer/documents/15/coordinates")
        .set("Cookie", cookie)
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
      const cookie = await login(URBAN_PLANNER);

      const res = await request(app)
        .patch("/kiruna_explorer/documents/9999/coordinates")
        .set("Cookie", cookie)
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
      const cookie = await login(URBAN_PLANNER);

      // Running test target function
      const res = await request(app)
        .patch("/kiruna_explorer/documents/15/coordinates")
        .set("Cookie", cookie)
        .send({
          type: CoordinatesType.POINT,
          coords: { lat: "invalid", lng: "invalid" },
        });

      // Checking results
      expect(res.status).toBe(422);
    });

    it("ERROR - Invalid id format", async () => {
      // Running test target function
      const cookie = await login(URBAN_PLANNER);
      
      const res = await request(app)
        .patch("/kiruna_explorer/documents/abc/coordinates")
        .set("Cookie", cookie)
        .send({
          type: CoordinatesType.POINT,
          coords: { lat: 67.85, lng: 20.22 },
        });

      // Checking results
      expect(res.status).toBe(422);
    });

    it("ERROR - Unauthorized", async () => {
        const res = await request(app)
        .patch("/kiruna_explorer/documents/15/coordinates")
        .send({
          type: CoordinatesType.POINT,
          coords: { lat: 67.85, lng: 20.22 },
        });

        expect(res.status).toBe(401);
    });

    it("ERROR - Forbidden", async () => {
        let cookie = await login(RESIDENT);
        let res = await request(app)
        .patch("/kiruna_explorer/documents/15/coordinates")
        .set("Cookie", cookie)
        .send({
          type: CoordinatesType.POINT,
          coords: { lat: 67.85, lng: 20.22 },
        });

        expect(res.status).toBe(403);
        cookie = await login(URBAN_DEVELOPER);
        res = await request(app)
        .patch("/kiruna_explorer/documents/15/coordinates")
        .set("Cookie", cookie)
        .send({
            type: CoordinatesType.POINT,
            coords: { lat: 67.85, lng: 20.22},
        });

        expect(res.status).toBe(403);
    });
  });
});
