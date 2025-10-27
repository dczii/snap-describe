import supertest from 'supertest';
import app from '../src/server/app';
import path from 'path';
import fs from 'fs';

describe('Listing test', () => {
  let accessToken: string;
  let signedUrl: string;
  let filePath: string;

  beforeAll(async () => {
    const loginResponse = await supertest(app)
      .post('/v1/auth/mobile/login')
      .send({
        email: 'Seller02@gmail.com',
        password: 'Seller01!',
      });
    accessToken = loginResponse.body.accessToken;

    const uploadUrlResponse = await supertest(app)
      .post('/api/v1/mobile/upload-url')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        images: [{ fileName: 'TEST_IMAGE.png', mimeType: 'image/png' }],
      });
    signedUrl = uploadUrlResponse.body[0].signedUrl;
    filePath = uploadUrlResponse.body[0].filePath;
  });

  it('should upload image to Supabase', async () => {
    const imagePath = path.join(__dirname, 'fixtures', 'TEST_IMAGE.png');
    const fileBuffer = fs.readFileSync(imagePath);

    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      headers: { 'Content-type': 'image/png' },
      body: fileBuffer,
    });

    expect(uploadResponse.ok).toBe(true);
  });

  it('should create listing via GraphQL', async () => {
    const query = `
      mutation createListing($data: CreateListingInput!) {
        createListing(data: $data) {
          message
        }
      }
    `;

    const variables = {
      data: {
        title: 'test',
        description: 'test',
        price: 100,
        qty: 100,
        condition: 'New',
        categoryId: 1,
        notes: 'Test',
        imageFilePaths: [filePath],
      },
    };

    //need i start server before testing
    const res = await supertest('http://localhost:4000')
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ query, variables });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});
