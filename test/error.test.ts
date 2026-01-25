import app from '../src/app';
import request from 'supertest';
// import {Article, Author} from '../src/types/LocalTypes';
// import randomstring from 'randomstring';

// test that server is running
describe('server should be running', () => {
  it('should return 200 OK', async () => {
    await request(app).get('/').expect(200);
  });
});

// // Create new article for testing
// const article: Article = {
//   article_id: 1, // some random id
//   title: 'Test Article',
//   description: 'This is the content of article 1',
//   author: 1, // some random author id
// };

// // Create new author for testing
// const author: Author = {
//   author_id: 1,
//   name: 'Test Author',
//   email: randomstring.generate(7) + '@metropolia.fi',
// };

describe('Testing authors endpoint errors', () => {
  // Test GET /authors/:id with non-existing id
  it('GET /authors/:id with non-existing id should return 404 with message', async () => {
    try {
      const response = await request(app)
        .get('/api/v1/authors/99999') // assuming this id does not exist
        .expect(404);
      expect(response.body).toHaveProperty('message', 'No author found');
    } catch (error) {
      console.error('Get non-existing author test failed:', error);
      throw error;
    }
  });
});
