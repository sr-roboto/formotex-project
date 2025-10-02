import {
  AuthDataSource,
  CustomError,
  RegisterUserDto,
  UserEntity,
} from '../../domain';

export class PgAuthDataSource implements AuthDataSource {
  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password, role } = registerUserDto;

    try {
      return new UserEntity(1, name, email, password, ['ADMIN_ROLE']);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServer();
    }
  }
}
