import { Router } from 'express';
import { AuthController } from './controller';
import { MongoAuthDataSource, MongoAuthRepository } from '../../infrastructure';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AdminMiddleware } from '../middlewares/admin.middleware';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const database = new MongoAuthDataSource();
    const authRepository = new MongoAuthRepository(database);
    const controller = new AuthController(authRepository);

    router.post('/login', controller.loginUser);

    router.post('/register', controller.registerUser);

    router.get('/profile', AuthMiddleware.verifyToken, controller.getProfile);

    router.get(
      '/users',
      AuthMiddleware.verifyToken,
      AdminMiddleware.checkAdminRole,
      controller.getUsers
    );
    router.get(
      '/users/:id',
      AuthMiddleware.verifyToken,
      AdminMiddleware.checkAdminRole,
      controller.getUserById
    );
    router.put(
      '/users/:id',
      AuthMiddleware.verifyToken,
      AdminMiddleware.checkAdminRole,
      controller.updateUser
    );
    router.delete(
      '/users/:id',
      AuthMiddleware.verifyToken,
      AdminMiddleware.checkAdminRole,
      controller.deleteUser
    );

    return router;
  }
}
