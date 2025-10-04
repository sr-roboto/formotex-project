import { JwtAdapter } from '../../../config';
import { RegisterUserDto } from '../../dtos/auth/register-user.dto';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';

interface RegisterUser {
  execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

interface UserToken {
  token: string;
  user: { id: string; name: string; email: string; role: string[] };
}

type SignToken = (payload: object, duration?: number) => Promise<string | null>;

export class RegisterUserCase implements RegisterUser {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}
  async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
    // Crear el usuario

    const user = await this.authRepository.register(registerUserDto);
    // Token
    const token = await this.signToken({ id: user.id, role: user.role });

    if (!token) {
      throw CustomError.internalServer('Error generating token');
    }

    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
