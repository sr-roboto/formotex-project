import { Router } from 'express';
import { AuthController } from './controller';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { MongoAuthDataSource, MongoAuthRepository } from '../../infrastructure';
import { AuthDataSource } from '../../domain';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const database = new MongoAuthDataSource();
    const authRepository = new MongoAuthRepository(database);
    const controller = new AuthController(authRepository);

    router.post('/login', controller.loginUser);

    router.post('/register', controller.registerUser);

    return router;
  }
}
