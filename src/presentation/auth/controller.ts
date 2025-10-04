import { Request, Response } from 'express';
import {
  CustomError,
  LoginUserDto,
  RegisterUserCase,
  RegisterUserDto,
} from '../../domain';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data/mongodb';
import { LoginUserUseCase } from '../../domain/use-cases/auth/login-user.use-case';

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  private HandleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    new LoginUserUseCase(this.authRepository)
      .execute(loginUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.HandleError(error, res));
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    new RegisterUserCase(this.authRepository)
      .execute(registerUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.HandleError(error, res));
  };

  getUsers = (req: Request, res: Response) => {
    UserModel.find()
      .then((users) => res.json({ token: req.body.payload }))
      .catch((error) => this.HandleError(error, res));
  };
}
