import supertest from 'supertest';
import app from '../src/server/app';

const loginMocks = {
  validUser: {
    email: 'Tester01@gmail.com',
    password: 'Tester123!',
  },

  invalidUser: {
    email: 'WrongEmail@gmail.com',
    password: 'WrongPassword',
  },
} as const;

describe('Login test', () => {
  it('should log in successfully with valid credentials', async () => {
    const res = await supertest(app)
      .post('/v1/auth/mobile/login')
      .send(loginMocks.validUser);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body).toHaveProperty('message');
  });

  it('should return 400 when user input is incorrect or invalid', async () => {
    const res = await supertest(app)
      .post('/v1/auth/mobile/login')
      .send(loginMocks.invalidUser);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('code');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toMatchObject({
      code: 'INVALID_CREDENTIALS',
      message: 'Incorrect email or password',
    });
  });

  it('should return 429 Too Many Request when request limit exceeded', async () => {
    const requests = Array.from({ length: 1000 }, () =>
      supertest(app).post('/v1/auth/mobile/login').send(loginMocks.validUser),
    );

    const results = await Promise.all(requests);

    const rateLimited = results.some((r) => r.status === 429);
    const successCount = results.filter((r) => r.status === 200).length;
    const rateLimitCount = results.filter((r) => r.status === 429).length;

    expect(rateLimited).toBe(true);
    expect(successCount).toBeGreaterThan(0);
    expect(rateLimitCount).toBeGreaterThan(0);
  });
});
