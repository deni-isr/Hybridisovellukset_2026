import express from 'express';
import {
  authorDelete,
  authorGet,
  authorPost,
  authorPut,
  authorsGet,
} from '../controllers/authorController';

const router = express.Router();

router.route('/').get(authorsGet).post(authorPost);

router.route('/:id').get(authorGet).put(authorPut).delete(authorDelete);

export default router;
