import { Validators } from '../../../config';

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
    public role: string = 'user'
  ) {}

  static create(object: {
    [key: string]: any;
  }): [string | null, RegisterUserDto?] {
    const { name, email, password, role } = object;

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

    if (!role || typeof role !== 'string') {
      return ['Invalid or missing role'];
    }

    return [null, new RegisterUserDto(name, email, password)];
  }
}
