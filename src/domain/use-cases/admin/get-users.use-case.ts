import { UserEntity } from '../../entities/user.entity';
import { AuthRepository } from '../../repositories/auth.repository';

export class GetUsersUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<UserEntity[]> {
    return await this.authRepository.getAllUsers();
  }
}
