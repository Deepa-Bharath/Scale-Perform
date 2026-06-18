// save product data to both database connected in the application
import {
  type PublicUser, type CreateUserInput, type User
} from "../../domain/entities/User.js";

export interface UserRepository {
   create(user: CreateUserInput): Promise<PublicUser>;
   findByEmail(email: string): Promise<User | null>;
   findByemailWithPasswordHash(email: string, password_hash: string): Promise<User | null>;
}
