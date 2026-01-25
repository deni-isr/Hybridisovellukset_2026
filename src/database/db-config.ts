const filename = 'example.sqlite';

const tables = `CREATE TABLE IF NOT EXISTS articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    author INTEGER,
    FOREIGN KEY (author) REFERENCES authors(author_id)
)`;

const authors = `CREATE TABLE IF NOT EXISTS authors (
    author_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
)`;

const checkAuthors = `SELECT COUNT(*) AS count FROM authors`;

const exampleAuthors = `INSERT INTO authors (name, email) VALUES
('John Doe', 'john.doe@example.com'),
('Jane Smith', 'jane.smith@example.com'),
('Alice Johnson', 'alice.johnson@example.com')`;

const checkData = `SELECT COUNT(*) AS count FROM articles`;

const exampleData = `INSERT INTO articles (title, description, author) VALUES
('Article 1', 'This is the first article', 1),
('Article 2', 'This is the second article', 3),
('Article 3', 'This is the third article', 2)`;

export {
  filename,
  tables,
  authors,
  checkAuthors,
  exampleAuthors,
  checkData,
  exampleData,
};
