import { type UserRepository } from "../../domain/repositories/UserRespository.js";
import { AppError } from "../../shared/AppError.js";
import type { AuthResponse } from "../../domain/entities/User.js";
import { createToken } from "../../shared/JSONWebToken.js";
import bcrypt from "bcryptjs";

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(email: string, password: string): Promise<AuthResponse> {
    // Implement the logic to authenticate the user
    // This typically involves checking the email and password against the database
    // and returning a token or user information if successful
    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new AppError('Invalid email or password', 401);
    }
    const token = await createToken(user.id);
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        token
    }
  }     
}
