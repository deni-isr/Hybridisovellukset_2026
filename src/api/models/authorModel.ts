import db from '../../database/db';
import {Author} from '../../types/LocalTypes';

const getAllAuthors = async () => {
  const stmt = await db.prepare('SELECT * FROM authors');
  return stmt.all() as Author[];
};

const getAuthor = async (id: number) => {
  const stmt = await db.prepare('SELECT * FROM authors WHERE author_id = ?');
  const author = stmt.get([id]) as Author | undefined;
  if (!author) {
    return null;
  }
  return author;
};

const createAuthor = async (author: Omit<Author, 'author_id'>) => {
  const stmt = await db.prepare('INSERT INTO authors (name, email) VALUES (?, ?)');
  stmt.run([author.name, author.email]);
  
  // Get the last inserted ID
  const latestStmt = await db.prepare(
    'SELECT author_id FROM authors ORDER BY author_id DESC LIMIT 1',
  );
  const latestResult = latestStmt.get() as {author_id: number} | undefined;
  if (!latestResult) {
    throw new Error('Failed to insert author');
  }
  return getAuthor(latestResult.author_id);
};

const updateAuthor = async (id: number, name: string, email: string): Promise<Author> => {
  const stmt = await db.prepare(
    'UPDATE authors SET name = ?, email = ? WHERE author_id = ?',
  );
  const result = stmt.run([name, email, id]);
  if (result.changes === 0) {
    throw new Error('Failed to update author');
  }
  const author = await getAuthor(id);
  if (!author) {
    throw new Error('Author not found after update');
  }
  return author;
};

const deleteAuthor = async (id: number): Promise<void> => {
  const deleteArticlesStmt = await db.prepare('DELETE FROM articles WHERE author = ?');
  deleteArticlesStmt.run([id]);
  
  const deleteAuthorStmt = await db.prepare('DELETE FROM authors WHERE author_id = ?');
  const result = deleteAuthorStmt.run([id]);
  if (result.changes === 0) {
    throw new Error('Author not found');
  }
};

export {getAllAuthors, getAuthor, createAuthor, updateAuthor, deleteAuthor};
