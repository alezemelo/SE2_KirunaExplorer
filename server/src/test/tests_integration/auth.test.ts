import request from 'supertest';
import { app, server } from '../../../index';
import db from '../../db/db';
import pgdb from '../../db/temp_db';
import { dbEmpty } from '../../db/db_common_operations';

beforeAll(async () => {
  await dbEmpty();

  const users = [
    { username: 'user1', password: 'pass1', hash: 'bf2df07b46d6a85cb229c06485763a5900e1a48692ed4963d1992d8bf02dcd1f', salt: '72d8722b20d83733b01e38b0b41798bf', type: 'resident' },
    { username: 'user2', password: 'pass2', hash: '39fd45f2d36fa1e9b8b94d651d1c0f938de4f9ef2b4de99582de10a36f061c6e', salt: '94a045007210042ae5333a1d04a0494f', type: 'urban_developer' },
    { username: 'user3', password: 'pass3', hash: 'd5a43cfbed4ef660d6449649c2599a35ecd1dcd74d67538a5695fbcb43d2dc8e', salt: '610dbce01d172d82fa4ad2d1005dfc5d', type: 'urban_planner' },
  ];

  for (const user of users) {
    const existingUser = await db('users').where({ username: user.username }).first();
    if (!existingUser) {
      await db('users').insert({
        username: user.username,
        hash: user.hash,
        salt: user.salt,
        type: user.type,
      });
    }
  }
});

afterAll(async () => {
  await dbEmpty();
  await pgdb.disconnect();
  server.close();
  await db.destroy();
});

describe('Authentication Tests', () => {
  describe('POST /kiruna_explorer/sessions - Login', () => {
    it('should log in successfully with correct credentials (user1)', async () => {
      const response = await request(app).post('/kiruna_explorer/sessions').send({
        username: 'user1',
        password: 'pass1',
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          username: 'user1',
          type: 'resident',
        })
      );
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 for incorrect password (user2)', async () => {
      const response = await request(app).post('/kiruna_explorer/sessions').send({
        username: 'user2',
        password: 'wrongPass',
      });
      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Incorrect username or password',
        })
      );
    });

    it('should return 401 for non-existing user', async () => {
      const response = await request(app).post('/kiruna_explorer/sessions').send({
        username: 'nonExistingUser',
        password: 'pass',
      });
      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Incorrect username or password',
        })
      );
    });
  });

  describe('DELETE /kiruna_explorer/sessions/current - Logout', () => {
    let userSessionCookie: string;

    beforeAll(async () => {
      const loginResponse = await request(app).post('/kiruna_explorer/sessions').send({
        username: 'user1',
        password: 'pass1',
      });
      userSessionCookie = loginResponse.headers['set-cookie'][0];
    });

    it('should successfully log out when logged in', async () => {
      const response = await request(app)
        .delete('/kiruna_explorer/sessions/current')
        .set('Cookie', userSessionCookie);
      expect(response.status).toBe(200);
    });

    it('should return 401 when trying to log out without being logged in', async () => {
      const response = await request(app).delete('/kiruna_explorer/sessions/current');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /kiruna_explorer/sessions/current - Get Current User', () => {
    let userSessionCookie: string;

    beforeAll(async () => {
      const loginResponse = await request(app).post('/kiruna_explorer/sessions').send({
        username: 'user2',
        password: 'pass2',
      });
      userSessionCookie = loginResponse.headers['set-cookie'][0];
    });

    it('should retrieve the current user when logged in (user2)', async () => {
      const response = await request(app)
        .get('/kiruna_explorer/sessions/current')
        .set('Cookie', userSessionCookie);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          username: 'user2',
          type: 'urban_developer',
        })
      );
    });

    it('should return 401 when trying to retrieve the current user without logging in', async () => {
      const response = await request(app).get('/kiruna_explorer/sessions/current');
      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: 'Unauthorized',
        })
      );
    });
  });
});
