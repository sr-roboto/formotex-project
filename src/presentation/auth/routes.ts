import { Router } from 'express';
import { AuthController } from './controller';
import { MongoAuthDataSource, MongoAuthRepository } from '../../infrastructure';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const database = new MongoAuthDataSource();
    const authRepository = new MongoAuthRepository(database);
    const controller = new AuthController(authRepository);

    router.post('/login', controller.loginUser);

    router.post('/register', controller.registerUser);

    router.get('/', AuthMiddleware.verifyToken, controller.getUsers);

    return router;
  }
}
