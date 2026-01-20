export interface Response {
  statusCode: number;
  message: string;
  status: string;
  data?: object | object[];
}

export type RepositoryType = 'mongoDB' |'postgreSQL';
