import { IsEnum, IsNumber, IsString } from 'class-validator';
import { AclPermission } from 'src/common/enums/Permission';

import { IAcl } from 'src/common/interfaces/acl';

export class CreateAclDto implements IAcl {
  @IsNumber()
  userId: number;

  @IsString()
  resource: string;

  @IsEnum(AclPermission)
  permission: AclPermission;
}
