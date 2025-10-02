import { RegisterUserDto } from '../dtos/auth/register-user.dto';
import { UserEntity } from '../entities/user.entity';

export abstract class AuthDataSource {
  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
