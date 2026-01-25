import db from '../../database/db';
import {Article} from '../../types/LocalTypes';

const getAllArticles = async () => {
  const stmt = await db.prepare('SELECT * FROM articles');
  return stmt.all() as Article[];
};

const getArticle = async (id: number | bigint): Promise<Article> => {
  const stmt = await db.prepare('SELECT * FROM articles WHERE article_id = ?');
  const result = stmt.get([id]) as Article | undefined;
  if (!result) {
    throw new Error('Article not found');
  }
  return result;
};

const createArticle = async (article: Omit<Article, 'id'>): Promise<Article> => {
  const stmt = await db.prepare(
    'INSERT INTO articles (title, description, author) VALUES (?, ?, ?)',
  );
  stmt.run([article.title, article.description, article.author]);
  
  // Get the last inserted ID - since sql.js doesn't track this, we'll query the latest
  const latestStmt = await db.prepare(
    'SELECT article_id FROM articles ORDER BY article_id DESC LIMIT 1',
  );
  const latestResult = latestStmt.get() as {article_id: number} | undefined;
  if (!latestResult) {
    throw new Error('Failed to insert article');
  }
  return getArticle(latestResult.article_id);
};

const updateArticle = async (
  id: number | bigint,
  title: string,
  description: string,
): Promise<Article> => {
  const stmt = await db.prepare(
    'UPDATE articles SET title = ?, description = ? WHERE article_id = ?',
  );
  const result = stmt.run([title, description, id]);
  if (result.changes === 0) {
    throw new Error('Failed to update article');
  }
  return getArticle(id);
};

const deleteArticle = async (id: number | bigint): Promise<void> => {
  const stmt = await db.prepare('DELETE FROM articles WHERE article_id = ?');
  const result = stmt.run([id]);
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
