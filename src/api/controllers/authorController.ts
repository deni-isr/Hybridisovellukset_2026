import {NextFunction, Request, Response} from 'express';
import {Author, MessageResponse} from '../../types/LocalTypes';
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthor,
  updateAuthor,
} from '../models/authorModel';
import CustomError from '../../classes/CustomError';

const authorsGet = async (
  req: Request,
  res: Response<Author[]>,
  next: NextFunction,
) => {
  try {
    const authors = await getAllAuthors();
    res.json(authors);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const authorGet = async (
  req: Request<{id: string}>,
  res: Response<Author>,
  next: NextFunction,
) => {
  try {
    const {id} = req.params;
    const author = await getAuthor(Number(id));
    if (!author) {
      next(new CustomError('No author found', 404));
      return;
    }
    res.json(author);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const authorPost = async (
  req: Request<unknown, unknown, Omit<Author, 'author_id'>>,
  res: Response<MessageResponse & {author: Author}>,
  next: NextFunction,
) => {
  try {
    const author = await createAuthor(req.body);
    if (!author) {
      next(new CustomError('Failed to create author', 500));
      return;
    }
    res.status(201).json({message: 'Author created successfully', author});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const authorPut = async (
  req: Request<{id: string}, unknown, Author>,
  res: Response<MessageResponse & {author: Author}>,
  next: NextFunction,
) => {
  try {
    const author = await updateAuthor(
      Number(req.params.id),
      req.body.name,
      req.body.email,
    );
    res.json({message: 'Author updated successfully', author});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const authorDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction,
) => {
  try {
    await deleteAuthor(Number(req.params.id));
    res.status(200).json({message: 'Author deleted successfully'});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {authorsGet, authorGet, authorPost, authorPut, authorDelete};
