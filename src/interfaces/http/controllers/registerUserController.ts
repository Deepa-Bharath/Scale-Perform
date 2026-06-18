import { RegisterUserUseCase } from "../../../application/usecases/RegisterUser.usecase.js";
import { type Result } from "../../../shared/types.js";

export class RegisterUserController {
  constructor(private useCase: RegisterUserUseCase) {}

  async handle(req: any): Promise<Result> {
    const { name, email, password } = req.body;
    const auth = await this.useCase.execute(name, email, password);
    return {
      statusCode: 201,
      message: "User registered successfully.",
      status: "success",
      data: auth,
    };
  }
}
