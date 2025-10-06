import { JwtPayload } from '../config';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
