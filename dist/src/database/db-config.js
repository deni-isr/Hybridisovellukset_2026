"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleData = exports.checkData = exports.tables = exports.filename = void 0;
const filename = 'example.sqlite';
exports.filename = filename;
const tables = `CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL
)`;
exports.tables = tables;
const checkData = `SELECT COUNT(*) AS count FROM articles`;
exports.checkData = checkData;
const exampleData = `INSERT INTO articles (title, description) VALUES
('Article 1', 'This is the first article'),
('Article 2', 'This is the second article'),
('Article 3', 'This is the third article')`;
exports.exampleData = exampleData;
//# sourceMappingURL=db-config.js.map