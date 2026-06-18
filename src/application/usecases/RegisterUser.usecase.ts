import { type AuthResponse, type CreateUserInput} from "../../domain/entities/User.js";
import { type UserRepository } from "../../domain/repositories/UserRespository.js";
import { AppError } from "../../shared/AppError.js";
import { createToken } from "../../shared/JSONWebToken.js";
import bcrypt from "bcryptjs";

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
      if (!name || !email || !password) {
        throw new AppError("Name, email, and password are required", 400);
      }
      const user = await this.userRepository.findByEmail(email);
      if (user) {
        throw new AppError("User already exists", 409);
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser: CreateUserInput =
        {
          name: name,
          email: email,
          password_hash: passwordHash,
        };
      const createdUser = await this.userRepository.create(newUser);
      const token = await createToken(createdUser.id);
      return {
        user: createdUser,
        token,
      };
    }
}
