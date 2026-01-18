"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articleController_1 = require("../controllers/articleController");
const router = express_1.default.Router();
router.route('/').get(articleController_1.articlesGet).post(articleController_1.articlePost);
router.route('/:id').get(articleController_1.articleGet).put(articleController_1.articlePut).delete(articleController_1.articleDelete);
exports.default = router;
//# sourceMappingURL=articleRouter.js.map