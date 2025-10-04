import { JwtAdapter, JwtPayload } from '../../../config';
import { LoginUserDto } from '../../dtos/auth/login-user.dto';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';

interface loginUser {
  execute(loginUserDto: LoginUserDto): Promise<UserToken>;
}

interface UserToken {
  token: string;
  user: { id: string; name: string; email: string; role: string[] };
}

type SignToken = (payload: object, duration?: number) => Promise<string | null>;

export class LoginUserUseCase implements loginUser {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}
  async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
    const user = await this.authRepository.login(loginUserDto);
    if (!user) {
      throw CustomError.unauthorized('Invalid credentials');
    }

    const token = await this.signToken({ id: user.id, role: user.role }); // ✅ Generar token
    if (!token) {
      throw CustomError.internalServer('Error generating token');
    }

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
