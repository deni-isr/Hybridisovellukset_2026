import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import {
  checkData,
  exampleData,
  filename,
  tables,
  authors,
  checkAuthors,
  exampleAuthors,
} from './db-config';

let SQL: any;
let db: any;

// Helper function to save database to file
function saveDatabase(database: any) {
  const filepath = path.join(process.cwd(), filename);
  const data = database.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(filepath, buffer);
}

// Initialize the database
async function initDatabase() {
  SQL = await initSqlJs();
  const filepath = path.join(process.cwd(), filename);

  if (fs.existsSync(filepath)) {
    const buffer = fs.readFileSync(filepath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // init tables, use exec for CREATE TABLE
  db.run(tables);
  db.run(authors);

  // check if the authors table is empty
  let authorCount = 0;
  try {
    const result = db.exec(checkAuthors);
    authorCount = result.length > 0 ? result[0].values[0][0] : 0;
  } catch (e) {
    authorCount = 0;
  }

  // If the table is empty, insert example authors
  if (authorCount === 0) {
    db.run(exampleAuthors);
    console.log('Inserted example authors.');
  } else {
    console.log('Authors table already populated.');
  }

  // Check if the articles table is empty
  let rowCount = 0;
  try {
    const result = db.exec(checkData);
    rowCount = result.length > 0 ? result[0].values[0][0] : 0;
  } catch (e) {
    rowCount = 0;
  }

  // If the table is empty, insert example data
  if (rowCount === 0) {
    db.run(exampleData);
    console.log('Inserted example data.');
  } else {
    console.log('Articles table already populated.');
  }

  // Save to file
  saveDatabase(db);

  return db;
}

// Wrapper for database operations
class DatabaseWrapper {
  private database: any;
  private initialized: boolean = false;

  async ensureInitialized() {
    if (!this.initialized) {
      this.database = await initDatabase();
      this.initialized = true;
    }
    return this.database;
  }

  async prepare(sql: string) {
    const database = await this.ensureInitialized();
    const stmt = database.prepare(sql);
    const self = this;
    return {
      get: (params: any = []) => {
        stmt.bind(Array.isArray(params) ? params : [params]);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.reset();
          return row;
        }
        stmt.reset();
        return undefined;
      },
      all: (params: any = []) => {
        stmt.bind(Array.isArray(params) ? params : [params]);
        const results = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.reset();
        return results;
      },
      run: (params: any = []) => {
        stmt.bind(Array.isArray(params) ? params : [params]);
        stmt.step();
        const changes = database.getRowsModified();
        stmt.reset();
        // Save after write operations
        saveDatabase(database);
        return {changes, lastInsertRowid: -1};
      },
    };
  }

  async exec(sql: string) {
    const database = await this.ensureInitialized();
    return database.exec(sql);
  }

  async transaction(fn: (db: any) => void) {
    return async (params: any) => {
      const database = await this.ensureInitialized();
      database.run('BEGIN TRANSACTION');
      try {
        await fn(params);
        database.run('COMMIT');
        saveDatabase(database);
      } catch (e) {
        database.run('ROLLBACK');
        throw e;
      }
    };
  }

  async pragma(pragma: string) {
    // sql.js doesn't support PRAGMA in the same way
    return null;
  }
}

const dbWrapper = new DatabaseWrapper();

export default dbWrapper;
