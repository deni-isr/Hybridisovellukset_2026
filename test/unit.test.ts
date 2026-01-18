import {
  getAllArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../src/api/models/articleModel';

import {Article} from '../src/types/LocalTypes';
import randomstring from 'randomstring';

// Create new article for testing
const article: Article = {
  id: 0,
  title: 'Test Article',
  description: 'This is the content of article 1',
};

// Unit tests to test functions in src/api/models/articleModel.ts
describe('Article functions', () => {
  // Test createArticle function
  it('createArticle should return the new article', async () => {
    const newArticle = await createArticle(article);
    expect(newArticle.title).toBe(article.title);
    expect(newArticle.description).toBe(article.description);
    article.id = newArticle.id;
  });

  // Test getArticle function
  it('getArticle should return the article', async () => {
    const foundArticle = await getArticle(article.id);
    expect(foundArticle).toEqual(article);
  });

  // Test getAllArticles function
  it('getAllArticles should return an array of articles', async () => {
    const articles = await getAllArticles();
    for (const article of articles) {
      expect(article).toHaveProperty('id');
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('description');
    }
  });

  // Test updateArticle function
  it('updateArticle should return the updated article', async () => {
    const updatedArticle = await updateArticle(
      article.id,
      'Updated Title',
      'Updated Description',
    );
    expect(updatedArticle.title).toBe('Updated Title');
    expect(updatedArticle.description).toBe('Updated Description');
  });
});

// Delete test data
describe('Delete test data', () => {
  // delete article
  it('deleteArticle should delete the article', async () => {
    await deleteArticle(article.id);
    await expect(getArticle(article.id)).rejects.toThrow('Article not found');
  });
});
