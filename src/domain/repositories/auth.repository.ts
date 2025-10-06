import { RegisterUserDto } from '../dtos/auth/register-user.dto';
import { UserEntity } from '../entities/user.entity';
import { LoginUserDto } from '../dtos/auth/login-user.dto';

export abstract class AuthRepository {
  abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
  abstract getAllUsers(): Promise<UserEntity[]>;
  abstract getUserById(id: string): Promise<UserEntity>;
  abstract updateUser(
    id: string,
    updateData: Partial<UserEntity>
  ): Promise<UserEntity>;
  abstract deleteUser(id: string): Promise<void>;
}
