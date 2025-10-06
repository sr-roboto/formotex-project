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

  loginUser = async (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    const foundUser = await new LoginUserUseCase(this.authRepository).execute(
      loginUserDto!
    );

    return res.status(200).json(foundUser);
  };

  registerUser = async (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    const data = await new RegisterUserCase(this.authRepository).execute(
      registerUserDto!
    );

    return res.status(201).json(data);
  };

  getUsers = async (req: Request, res: Response) => {
    if (req.user?.role.includes('admin') === false) {
      return this.HandleError(
        CustomError.forbidden(
          'You do not have permission to access this resource'
        ),
        res
      );
    }
    const users = await UserModel.find().select('-password');
    return res.json(users);
  };
}
