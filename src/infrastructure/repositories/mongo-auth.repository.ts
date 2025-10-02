import {
  AuthDataSource,
  AuthRepository,
  RegisterUserDto,
  UserEntity,
} from '../../domain';

export class MongoAuthRepository implements AuthRepository {
  constructor(private readonly authDataSource: AuthDataSource) {}

  register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.authDataSource.register(registerUserDto);
  }
}
