import { UserModel } from '../../data/mongodb';
import { BcryptAdapter } from '../../config/bcrypt';

import {
  AuthDataSource,
  CustomError,
  RegisterUserDto,
  UserEntity,
} from '../../domain';
import { UserMapper } from '../mappers/user.mapper';

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
}
