import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../domain';

export class AdminMiddleware {
  static checkAdminRole = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.user.role.includes('ADMIN')) {
      return res.status(403).json({
        error: 'You do not have permission to access this resource',
      });
    }

    next();
  };
}
