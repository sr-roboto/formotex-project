import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config';

export class AuthMiddleware {
  static verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const token = authHeader.split(' ')[1] || '';

    try {
      const payload = await JwtAdapter.verifyToken(token);
      if (!payload) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      if (!req.body) {
        req.body = {};
      }
      req.body.payload = payload;
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
