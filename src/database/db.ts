import sqlite3 from 'sqlite3';
import {filename, tables} from './db-config';

// Create database instance
export const database = new sqlite3.Database(filename, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    // Enable foreign keys
    database.run('PRAGMA foreign_keys = ON');
    // Create tables
    database.exec(tables, (error) => {
      if (error) {
        console.error('Error creating tables:', error);
      }
    });
  }
});

// Promisify database methods for easier usage
const db = {
  run: (sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> => {
    return new Promise((resolve, reject) => {
      database.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  get: (sql: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
      database.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all: (sql: string, params: any[] = []): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      database.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  },
  exec: (sql: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      database.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },
};

export default db;
