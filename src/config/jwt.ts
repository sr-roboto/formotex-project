import jwt from 'jsonwebtoken';
import { envs } from './envs';

export interface JwtPayload {
  id: string;
  role: string[];
  iat?: number;
  exp?: number;
}

export class JwtAdapter {
  static async generateToken(
    payload: object,
    duration: number = 2 * 60 * 60
  ): Promise<string | null> {
    return new Promise((resolve) => {
      jwt.sign(
        payload,
        envs.JWT_SECRET,
        { expiresIn: duration },
        (err, token) => {
          if (err) {
            return resolve(null);
          }
          resolve(token!);
        }
      );
    });
  }

  static async verifyToken(token: string): Promise<JwtPayload | null> {
    return new Promise((resolve) => {
      jwt.verify(token, envs.JWT_SECRET, (err, decoded) => {
        if (err) {
          return resolve(null);
        }
        resolve(decoded as JwtPayload);
      });
    });
  }
}
