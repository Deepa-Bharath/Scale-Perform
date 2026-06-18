export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password_hash: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
}
