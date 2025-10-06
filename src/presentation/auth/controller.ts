import { Request, Response } from 'express';
import {
  CustomError,
  LoginUserDto,
  RegisterUserCase,
  RegisterUserDto,
} from '../../domain';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { UserModel } from '../../data/mongodb';
import { LoginUserUseCase } from '../../domain/use-cases/auth/login-user.use-case';
import { GetUsersUseCase } from '../../domain/use-cases/admin/get-users.use-case';
import { GetUserByIdUseCase } from '../../domain/use-cases/admin/get-user-by-id.use-case';
import { UpdateUserDto } from '../../domain/dtos/auth/update-user.dto';
import { UpdateUserUseCase } from '../../domain/use-cases/admin/update-user.use-case';
import { DeleteUserUseCase } from '../../domain/use-cases/admin/delete-user.use-case';
import th from 'zod/v4/locales/th.js';

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

    try {
      const foundUser = await new LoginUserUseCase(this.authRepository).execute(
        loginUserDto!
      );
      return res.status(200).json(foundUser);
    } catch (error) {
      return this.HandleError(error, res);
    }
  };

  registerUser = async (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    try {
      const data = await new RegisterUserCase(this.authRepository).execute(
        registerUserDto!
      );
      return res.status(201).json(data);
    } catch (error) {
      return this.HandleError(error, res);
    }
  };

  // Métodos de admin con use cases
  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await new GetUsersUseCase(this.authRepository).execute();
      return res.json(users);
    } catch (error) {
      return this.HandleError(error, res);
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw CustomError.badRequest('User ID is required');
      }
      const user = await new GetUserByIdUseCase(this.authRepository).execute(
        id
      );
      return res.json(user);
    } catch (error) {
      return this.HandleError(error, res);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw CustomError.badRequest('User ID is required');
      }

      const [error, updateUserDto] = UpdateUserDto.create(req.body);
      if (error) {
        throw CustomError.badRequest(error);
      }

      const user = await new UpdateUserUseCase(this.authRepository).execute(
        id,
        updateUserDto!
      );
      return res.json(user);
    } catch (error) {
      return this.HandleError(error, res);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw CustomError.badRequest('User ID is required');
      }

      await new DeleteUserUseCase(this.authRepository).execute(id);
      return res.status(204).send();
    } catch (error) {
      return this.HandleError(error, res);
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        throw CustomError.unauthorized('User not authenticated');
      }

      const user = await new GetUserByIdUseCase(this.authRepository).execute(
        req.user.id
      );

      return res.json(user);
    } catch (error) {
      return this.HandleError(error, res);
    }
  };
}
