"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const articleModel_1 = require("../src/api/models/articleModel");
// Create new article for testing
const article = {
    id: 0,
    title: 'Test Article',
    description: 'This is the content of article 1',
};
// Unit tests to test functions in src/api/models/articleModel.ts
describe('Article functions', () => {
    // Test createArticle function
    it('createArticle should return the new article', async () => {
        const newArticle = await (0, articleModel_1.createArticle)(article);
        expect(newArticle.title).toBe(article.title);
        expect(newArticle.description).toBe(article.description);
        article.id = newArticle.id;
    });
    // Test getArticle function
    it('getArticle should return the article', async () => {
        const foundArticle = await (0, articleModel_1.getArticle)(article.id);
        expect(foundArticle).toEqual(article);
    });
    // Test getAllArticles function
    it('getAllArticles should return an array of articles', async () => {
        const articles = await (0, articleModel_1.getAllArticles)();
        for (const article of articles) {
            expect(article).toHaveProperty('id');
            expect(article).toHaveProperty('title');
            expect(article).toHaveProperty('description');
        }
    });
    // Test updateArticle function
    it('updateArticle should return the updated article', async () => {
        const updatedArticle = await (0, articleModel_1.updateArticle)(article.id, 'Updated Title', 'Updated Description');
        expect(updatedArticle.title).toBe('Updated Title');
        expect(updatedArticle.description).toBe('Updated Description');
    });
});
// Delete test data
describe('Delete test data', () => {
    // delete article
    it('deleteArticle should delete the article', async () => {
        await (0, articleModel_1.deleteArticle)(article.id);
        await expect((0, articleModel_1.getArticle)(article.id)).rejects.toThrow('Article not found');
    });
});
//# sourceMappingURL=unit.test.js.map