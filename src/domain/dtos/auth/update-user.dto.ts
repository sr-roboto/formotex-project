export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;

  static create(object: {
    [key: string]: any;
  }): [string | null, UpdateUserDto?] {
    const { name, email, password } = object;
    const updateData: UpdateUserDto = {};
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return ['Invalid name'];
      }
      updateData.name = name;
    }
    if (email !== undefined) {
      if (typeof email !== 'string' || email.trim() === '') {
        return ['Invalid email'];
      }
      updateData.email = email.toLowerCase();
    }
    if (password !== undefined) {
      if (typeof password !== 'string' || password.length < 6) {
        return ['Password must be at least 6 characters long'];
      }
      updateData.password = password;
    }
    if (Object.keys(updateData).length === 0) {
      return ['No valid fields to update'];
    }
    return [null, updateData];
  }
}
