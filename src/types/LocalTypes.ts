type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type Article = {
  article_id: number;
  title: string;
  description: string;
  author: number;
};

type Author = {
  author_id: number;
  name: string;
  email: string;
};

export type {MessageResponse, ErrorResponse, Article, Author};
