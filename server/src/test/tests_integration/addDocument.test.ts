import request from 'supertest';
import { app, server } from '../../../index';
import db from '../../db/db';
import pgdb from '../../db/temp_db';
import { dbEmpty, dbPopulate, dbPopulateActualData } from '../../db/db_common_operations';
import { populate } from '../populate_for_some_tests';

import { URBAN_DEVELOPER, URBAN_PLANNER, RESIDENT, login} from "./test_utility";

const testPort = 3001; 
//let server: any;

beforeAll(async () => {
    await dbEmpty(); 
    /*
    const adminExists = await db('users').where({ username: 'admin' }).first();

    if (!adminExists) {
        await db('users').insert({
            username: 'admin',
            hash: '$2b$10$uS9k2.1FhG/ZVjcW.TZ7JuI2RkP5VV08lkvWyVrr6Tf.hU9zJvMya',
            salt: '$2b$10$uS9k2.1FhG/ZVjcW.TZ7Ju',
            type: 'urban_planner',
        });
    }
    */

    //server = app.listen(testPort);
});

beforeEach(async () => {
    await dbEmpty(); // Clear the database before each test
    //await dbPopulate(); // Populate the database with sample dat
    //await populate();
    await dbPopulateActualData();
})

afterAll(async () => {
    await dbEmpty();
    /*
    if (server) {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    }
    */
   server.close();
    await pgdb.disconnect();
    await db.destroy();
});

describe('POST /kiruna_explorer/documents', () => {
    it('should successfully add a document with valid POINT coordinates', async () => {
        const validDocument = {
            title: 'Valid Point Document',
            type: 'technical_doc',
            issuanceDate: '2023-01-01',
            language: 'en',
            pages: 10,
            stakeholders: ['Residents'],
            scale: '1:1000',
            description: 'A document with POINT coordinates',
            coordinates: {
                type: 'POINT',
                coords: { lat: 65.583, lng: 22.183 },
            },
            lastModifiedBy: 'admin',
        };
        const cookie = await login(URBAN_PLANNER);
        const response = await request(app).post('/kiruna_explorer/documents').set("Cookie", cookie).send(validDocument);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: 'Document added successfully',
            documentId: expect.any(Number),
        });
    });

    

    it('should return validation error for missing required fields', async () => {
        const invalidDocument = {
            type: 'technical_doc',
        };
        const cookie = await login(URBAN_PLANNER);
        const response = await request(app).post('/kiruna_explorer/documents').set("Cookie", cookie).send(invalidDocument);
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: 'Title must be a string', path: 'title' }),
                expect.objectContaining({ msg: 'Last modified by must be a string', path: 'lastModifiedBy' }),
            ])
        );
    });

    it('should return validation error for invalid POINT coordinates', async () => {
        const invalidDocument = {
            title: 'Invalid Point Document',
            type: 'technical_doc',
            lastModifiedBy: 'admin',
            coordinates: {
                type: 'POINT',
                coords: { lat: 'invalid', lng: 22.183 },
            },
        };
        const cookie = await login(URBAN_PLANNER);
        const response = await request(app).post('/kiruna_explorer/documents').set("Cookie", cookie).send(invalidDocument);
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: 'Invalid POINT coordinates: lat and lng must be numbers',
                    path: 'coordinates',
                }),
            ])
        );
    });

    it('should return validation error for unsupported coordinates type', async () => {
        const invalidDocument = {
            title: 'Invalid Coordinates Type',
            type: 'policy_doc',
            lastModifiedBy: 'admin',
            coordinates: {
                type: 'UNSUPPORTED',
            },
        };

        const cookie = await login(URBAN_PLANNER);
        const response = await request(app).post('/kiruna_explorer/documents').set("Cookie", cookie).send(invalidDocument);
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: 'Invalid coordinates type',
                    path: 'coordinates',
                    type : 'field',
                }),
            ])
        );
    });
});
