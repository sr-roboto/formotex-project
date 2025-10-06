import { Validators } from '../../../config';

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}

  static create(object: {
    [key: string]: any;
  }): [string | null, RegisterUserDto?] {
    const { name, email, password } = object;

    if (!name || typeof name !== 'string') {
      return ['Invalid or missing name'];
    }

    if (!email || typeof email !== 'string') {
      return ['Invalid or missing email'];
    }

    if (!Validators.email.test(email)) {
      return ['Invalid email format'];
    }

    if (!password || typeof password !== 'string') {
      return ['Invalid or missing password'];
    }

    if (password.length < 6) {
      return ['Password must be at least 6 characters long'];
    }

    return [null, new RegisterUserDto(name, email.toLowerCase(), password)];
  }
}
