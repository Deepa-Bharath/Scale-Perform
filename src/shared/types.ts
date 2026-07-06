export interface Result {
  statusCode: number;
  message: string;
  status: string;
  data?: object | object[] | null;
}

export type RepositoryType = 'mongoDB' | 'postgreSQL';
