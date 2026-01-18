import {NextFunction, Request, Response} from 'express';
import {Article} from '../../types/LocalTypes';
import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticle,
  updateArticle,
} from '../models/articleModel';
import CustomError from '../../classes/CustomError';

const articlesGet = async (req: Request, res: Response<Article[]>, next: NextFunction) => {
  try {
    const articles = await getAllArticles();
    res.json(articles);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const articleGet = async (
  req: Request<{id: string}>,
  res: Response<Article>,
  next: NextFunction,
) => {
  try {
    const article = await getArticle(Number(req.params.id));
    res.json(article);
  } catch (error) {
    next(new CustomError((error as Error).message, 404));
  }
};

const articlePost = async (
  req: Request<unknown, unknown, Article>,
  res: Response<Article>,
  next: NextFunction,
) => {
  try {
    const article = await createArticle(req.body);
    res.status(201).json(article);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const articlePut = async (
  req: Request<{id: string}, unknown, Article>,
  res: Response<Article>,
  next: NextFunction,
) => {
  try {
    const article = await updateArticle(
      Number(req.params.id),
      req.body.title,
      req.body.description,
    );
    res.json(article);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const articleDelete = async (
  req: Request<{id: string}>,
  res: Response<unknown>,
  next: NextFunction,
) => {
  try {
    await deleteArticle(Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {articlesGet, articleGet, articlePost, articlePut, articleDelete};
