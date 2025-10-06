import { AuthRepository } from '../../repositories/auth.repository';

export class DeleteUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(id: string): Promise<void> {
    return await this.authRepository.deleteUser(id);
  }
}
