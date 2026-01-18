"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const CustomError_1 = __importDefault(require("./classes/CustomError"));
const notFound = (req, res, next) => {
    const error = new CustomError_1.default(`🔍 - Not Found - ${req.originalUrl}`, 404);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    // console.log(err);
    const statusCode = err.status !== 200 ? err.status || 500 : 500;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=middlewares.js.map