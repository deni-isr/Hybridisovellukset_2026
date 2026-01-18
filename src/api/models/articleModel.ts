import db from '../../database/db';
import {Article} from '../../types/LocalTypes';

const getAllArticles = async (): Promise<Article[]> => {
  return db.all('SELECT * FROM articles');
};

const getArticle = async (id: number | bigint): Promise<Article> => {
  const result = await db.get('SELECT * FROM articles WHERE id = ?', [id]);
  if (!result) {
    throw new Error('Article not found');
  }
  return result;
};

const createArticle = async (article: Omit<Article, 'id'>): Promise<Article> => {
  const result = await db.run('INSERT INTO articles (title, description) VALUES (?, ?)', [
    article.title,
    article.description,
  ]);
  if (!result.lastID) {
    throw new Error('Failed to insert article');
  }
  return getArticle(result.lastID);
};

const updateArticle = async (
  id: number | bigint,
  title: string,
  description: string,
): Promise<Article> => {
  const result = await db.run('UPDATE articles SET title = ?, description = ? WHERE id = ?', [
    title,
    description,
    id,
  ]);
  if (result.changes === 0) {
    throw new Error('Failed to update article');
  }
  return getArticle(id);
};

const deleteArticle = async (id: number | bigint): Promise<void> => {
  const result = await db.run('DELETE FROM articles WHERE id = ?', [id]);

  if (result.changes === 0) {
    throw new Error('Article not found');
  }
};

export {
  getAllArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
};
