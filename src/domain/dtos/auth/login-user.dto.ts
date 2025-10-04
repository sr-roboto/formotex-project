import { Validators } from '../../../config';

export class LoginUserDto {
  private constructor(public email: string, public password: string) {}
  static create(object: {
    [key: string]: any;
  }): [string | null, LoginUserDto?] {
    const { email, password } = object;

    if (!email || typeof email !== 'string') {
      return ['Invalid or missing email'];
    }

    if (!Validators.email.test(email)) {
      return ['Invalid email format'];
    }

    if (!password || typeof password !== 'string') {
      return ['Invalid or missing password'];
    }

    return [null, new LoginUserDto(email, password)];
  }
}
