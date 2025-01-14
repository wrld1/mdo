import { AclPermission } from '../enums/Permission';

export interface IAcl {
  userId: number;
  // user: User;
  resource: string;
  permission: AclPermission;
}

export interface AclResponse {
  resource: string;
  permission: string;
}
