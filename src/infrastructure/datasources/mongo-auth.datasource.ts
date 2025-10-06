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

      console.error('Register error:', error);
      throw CustomError.internalServer('Registration failed');
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
      if (error instanceof CustomError) {
        throw error;
      }

      console.error('Login error:', error);
      throw CustomError.internalServer('Login failed');
    }
  }

  async getAllUsers(): Promise<UserEntity[]> {
    try {
      const users = await UserModel.find({}).select('-password');
      return users.map((user) => UserMapper.userEntityFromObject(user));
    } catch (error) {
      console.error('Get all users error:', error);
      throw CustomError.internalServer('Error fetching users');
    }
  }

  async getUserById(id: string): Promise<UserEntity> {
    try {
      const user = await UserModel.findById(id).select('-password');
      if (!user) {
        throw CustomError.notFound('User not found');
      }
      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error('Get user by id error:', error);
      throw CustomError.internalServer('Error fetching user');
    }
  }

  async updateUser(
    id: string,
    updateData: Partial<UserEntity>
  ): Promise<UserEntity> {
    try {
      if (updateData.password) {
        updateData.password = BcryptAdapter.hash(updateData.password);
      }

      const user = await UserModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).select('-password');

      if (!user) {
        throw CustomError.notFound('User not found');
      }

      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error('Update user error:', error);
      throw CustomError.internalServer('Error updating user');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const user = await UserModel.findByIdAndDelete(id);
      if (!user) {
        throw CustomError.notFound('User not found');
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error('Delete user error:', error);
      throw CustomError.internalServer('Error deleting user');
    }
  }
}
