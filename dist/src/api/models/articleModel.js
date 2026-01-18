"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.createArticle = exports.getArticle = exports.getAllArticles = void 0;
const db_1 = __importDefault(require("../../database/db"));
const getAllArticles = async () => {
    return db_1.default.all('SELECT * FROM articles');
};
exports.getAllArticles = getAllArticles;
const getArticle = async (id) => {
    const result = await db_1.default.get('SELECT * FROM articles WHERE id = ?', [id]);
    if (!result) {
        throw new Error('Article not found');
    }
    return result;
};
exports.getArticle = getArticle;
const createArticle = async (article) => {
    const result = await db_1.default.run('INSERT INTO articles (title, description) VALUES (?, ?)', [
        article.title,
        article.description,
    ]);
    if (!result.lastID) {
        throw new Error('Failed to insert article');
    }
    return getArticle(result.lastID);
};
exports.createArticle = createArticle;
const updateArticle = async (id, title, description) => {
    const result = await db_1.default.run('UPDATE articles SET title = ?, description = ? WHERE id = ?', [
        title,
        description,
        id,
    ]);
    if (result.changes === 0) {
        throw new Error('Failed to update article');
    }
    return getArticle(id);
};
exports.updateArticle = updateArticle;
const deleteArticle = async (id) => {
    const result = await db_1.default.run('DELETE FROM articles WHERE id = ?', [id]);
    if (result.changes === 0) {
        throw new Error('Article not found');
    }
};
exports.deleteArticle = deleteArticle;
//# sourceMappingURL=articleModel.js.map