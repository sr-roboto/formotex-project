import { UserModel } from '../../data/mongodb';
import { BcryptAdapter } from '../../config/bcrypt';

import {
  AuthDataSource,
  CustomError,
  RegisterUserDto,
  UserEntity,
} from '../../domain';
import { UserMapper } from '../mappers/user.mapper';
import { LoginUserDto } from '../../domain';
import th from 'zod/v4/locales/th.js';

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashedPassword: string) => boolean;

export class MongoAuthDataSource implements AuthDataSource {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;

    try {
      const emailFound = await UserModel.findOne({
        email,
      });

      if (emailFound) {
        throw CustomError.badRequest('Email already registered');
      }

      const user = await (
        await UserModel.create({
          name: name,
          email: email,
          password: this.hashPassword(password),
        })
      ).save();

      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServer();
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw CustomError.unauthorized('Invalid credentials');
      }

      const isPasswordValid = this.comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw CustomError.unauthorized('Invalid credentials');
      }
      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      throw CustomError.internalServer();
    }
  }
}
