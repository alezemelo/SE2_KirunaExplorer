import request from 'supertest';
import { app, server } from '../../../index';
import db from '../../db/db';
import dbpg from '../../db/temp_db';


beforeAll(async () => {
  const adminExists = await db('users').where({ username: 'admin' }).first();

  if (!adminExists) {
    await db('users').insert({
      username: 'admin',
      hash: '$2b$10$uS9k2.1FhG/ZVjcW.TZ7JuI2RkP5VV08lkvWyVrr6Tf.hU9zJvMya',
      salt: '$2b$10$uS9k2.1FhG/ZVjcW.TZ7Ju',       
      type: 'urban_planner'
    });
  }
});

afterAll(async () => {
  await dbpg.disconnect();
  server.close();
  await db.destroy(); // Ensure the database connection is closed after tests
});

describe('POST /kiruna_explorer/documents - Add a document', () => {
  it('should successfully add a document with valid data', async () => {
    const validDocument = {
      title: 'Sample Document',
      type: 'informative_doc',
      issuanceDate: '2023-01-01',
      language: 'en',
      pages: 10,
      stakeholders: 'City Council',
      scale: '1:500',
      description: 'A sample informative document',
      coordinates: { lat: 65.583, lng: 22.183 },
      last_modified_by: 'admin'  
    };

    const response = await request(app).post('/kiruna_explorer/documents/').send(validDocument);
    console.log('Response for valid data:', response.body); 
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Document added successfully',
      documentId: expect.any(Number),
    });
  });

  it('should return validation errors for missing required fields', async () => {
    const invalidDocument = {
      type: 'Report', // Missing title
    };

    const response = await request(app).post('/kiruna_explorer/documents').send(invalidDocument);
    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Invalid value',
          path: 'title',
          location: 'body', 
          type: 'field', 
        }),
      ])
    );
  });

  it('should return validation error if coordinates are invalid', async () => {
    const invalidCoordinatesDocument = {
      title: 'Test Title',
      type: 'Report',
      coordinates: { lat: 'invalid', lng: 'invalid' }, // Invalid coordinates
    };

    const response = await request(app).post('/kiruna_explorer/documents').send(invalidCoordinatesDocument);
    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'coordinates are not valide.',
          path: 'coordinates',
          location: 'body',
          type: 'field',
        }),
      ])
    );
  });
});

afterAll(async () => {
  await db.destroy(); 
  server.close(); 
});

