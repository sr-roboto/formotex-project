import { UserEntity } from '../../entities/user.entity';
import { AuthRepository } from '../../repositories/auth.repository';

export class GetUserByIdUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(id: string): Promise<UserEntity> {
    return await this.authRepository.getUserById(id);
  }
}
