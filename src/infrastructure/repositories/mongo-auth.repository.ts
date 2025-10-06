import {
  AuthDataSource,
  AuthRepository,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from '../../domain';

export class MongoAuthRepository implements AuthRepository {
  constructor(private readonly authDataSource: AuthDataSource) {}
  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    return this.authDataSource.login(loginUserDto);
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.authDataSource.register(registerUserDto);
  }

  // Métodos para admin CRUD
  async getAllUsers(): Promise<UserEntity[]> {
    return this.authDataSource.getAllUsers();
  }

  async getUserById(id: string): Promise<UserEntity> {
    return this.authDataSource.getUserById(id);
  }

  async updateUser(
    id: string,
    updateData: Partial<UserEntity>
  ): Promise<UserEntity> {
    return this.authDataSource.updateUser(id, updateData);
  }

  async deleteUser(id: string): Promise<void> {
    return this.authDataSource.deleteUser(id);
  }
}
