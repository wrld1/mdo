import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, roundsOfHashing);
}
