import { Request, Response } from 'express';
import { CustomError, RegisterUserDto } from '../../domain';
import { AuthRepository } from '../../domain/repositories/auth.repository';

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  private HandleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  loginUser = (req: Request, res: Response) => {};

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    this.authRepository
      .register(registerUserDto!)
      .then((user) => {
        return res.status(201).json(user);
      })
      .catch((error) => this.HandleError(error, res));
  };
}
