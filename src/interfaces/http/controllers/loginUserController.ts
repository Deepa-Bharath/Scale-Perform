import { LoginUserUseCase } from "../../../application/usecases/LoginUser.usecase.js";
import { type Result } from "../../../shared/types.js";

export class LoginUserController {
  constructor(private useCase: LoginUserUseCase) {}

  async handle(req: any): Promise<Result> {
    const { email, password } = req.body;
    const authResponse = await this.useCase.execute(email, password);
    return {
      statusCode: 200,
      message: "Login successful.",
      status: "success",
      data: authResponse
    };
  }
}
