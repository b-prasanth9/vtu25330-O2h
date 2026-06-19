const request = require('supertest');
const app = require('../index');

describe('Tasks API', () => {
  it('GET /tasks should return 401 without token', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(401);
  }, 10000);
});
