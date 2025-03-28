import { AuthType } from '../enums/AuthType';
import { FraudStatus } from '../enums/FraudStatus';
import { AclResponse } from './acl';

export interface IUser {
  email?: string;
  password: string;
  phoneNumber?: string;
  authType: AuthType;
}

export interface UserResponse {
  email: string;
  isVerified: boolean;
  fraudStatus: FraudStatus;
  acl: AclResponse[];
}
