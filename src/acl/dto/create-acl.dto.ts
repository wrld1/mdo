import { User } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { AclPermission } from 'src/common/enums/Permission';

import { IAcl } from 'src/common/interfaces/acl';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateAclDto implements IAcl {
  @IsNumber()
  userId: number;

  @IsString()
  resource: string;

  @ValidateNested()
  @Type(() => CreateUserDto)
  user: User;

  @IsEnum(AclPermission)
  permission: AclPermission;
}
