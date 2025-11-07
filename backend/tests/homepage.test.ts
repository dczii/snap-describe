import supertest from "supertest";
import app from "../src/server/app";

describe('Homepage test', () => {
    let accessToken: string;

    beforeAll(async () => {
    const loginResponse = await supertest(app)
        .post('/v1/auth/mobile/login')
        .send({
        email: 'Seller02@gmail.com',
        password: 'Seller01!',
        });
         accessToken = loginResponse.body.accessToken;
    });

    //simple test for now
    it ('should fetch homepage listings and categories', async () => {
        const query = `
            query GetallListings {
                listingsWithCategories {
                    message
                    homepageData {
                        listings {
                            title
                            price
                            city
                            fileUrl
                        }
                        categories {
                            id
                            name
                            slug
                            parentId
                        }
                    }
                    
                }
            }
        `;
        const res = await supertest('http://localhost:4000')
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({query, variables: {}});
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data')
    })
})