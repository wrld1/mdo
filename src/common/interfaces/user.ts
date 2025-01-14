import { FraudStatus } from '../enums/FraudStatus';
import { AclResponse } from './acl';

export interface IUser {
  email: string;
  password: string;
}

export interface UserResponse {
  email: string;
  isVerified: boolean;
  fraudStatus: FraudStatus;
  Acl: AclResponse[];
}
