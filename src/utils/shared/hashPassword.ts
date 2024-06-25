import { roundsOfHashing } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, roundsOfHashing);
}
