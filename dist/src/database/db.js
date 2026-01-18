"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const db_config_1 = require("./db-config");
// Create database instance
exports.database = new sqlite3_1.default.Database(db_config_1.filename, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    }
    else {
        console.log('Connected to SQLite database');
        // Enable foreign keys
        exports.database.run('PRAGMA foreign_keys = ON');
        // Create tables
        exports.database.exec(db_config_1.tables, (error) => {
            if (error) {
                console.error('Error creating tables:', error);
            }
        });
    }
});
// Promisify database methods for easier usage
const db = {
    run: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            exports.database.run(sql, params, function (err) {
                if (err)
                    reject(err);
                else
                    resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    },
    get: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            exports.database.get(sql, params, (err, row) => {
                if (err)
                    reject(err);
                else
                    resolve(row);
            });
        });
    },
    all: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            exports.database.all(sql, params, (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows || []);
            });
        });
    },
    exec: (sql) => {
        return new Promise((resolve, reject) => {
            exports.database.exec(sql, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    },
};
exports.default = db;
//# sourceMappingURL=db.js.map