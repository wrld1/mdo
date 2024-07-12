import { RoleEnum } from '../enums/Role';

export interface IUser {
  email: string;
  password: string;
  role?: RoleEnum;
}
