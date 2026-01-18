"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleDelete = exports.articlePut = exports.articlePost = exports.articleGet = exports.articlesGet = void 0;
const articleModel_1 = require("../models/articleModel");
const CustomError_1 = __importDefault(require("../../classes/CustomError"));
const articlesGet = async (req, res, next) => {
    try {
        const articles = await (0, articleModel_1.getAllArticles)();
        res.json(articles);
    }
    catch (error) {
        next(new CustomError_1.default(error.message, 500));
    }
};
exports.articlesGet = articlesGet;
const articleGet = async (req, res, next) => {
    try {
        const article = await (0, articleModel_1.getArticle)(Number(req.params.id));
        res.json(article);
    }
    catch (error) {
        next(new CustomError_1.default(error.message, 404));
    }
};
exports.articleGet = articleGet;
const articlePost = async (req, res, next) => {
    try {
        const article = await (0, articleModel_1.createArticle)(req.body);
        res.status(201).json(article);
    }
    catch (error) {
        next(new CustomError_1.default(error.message, 500));
    }
};
exports.articlePost = articlePost;
const articlePut = async (req, res, next) => {
    try {
        const article = await (0, articleModel_1.updateArticle)(Number(req.params.id), req.body.title, req.body.description);
        res.json(article);
    }
    catch (error) {
        next(new CustomError_1.default(error.message, 500));
    }
};
exports.articlePut = articlePut;
const articleDelete = async (req, res, next) => {
    try {
        await (0, articleModel_1.deleteArticle)(Number(req.params.id));
        res.status(204).end();
    }
    catch (error) {
        next(new CustomError_1.default(error.message, 500));
    }
};
exports.articleDelete = articleDelete;
//# sourceMappingURL=articleController.js.map