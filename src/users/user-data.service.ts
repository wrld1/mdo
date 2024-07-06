import { Injectable } from '@nestjs/common';
import { IUser } from 'src/common/interfaces/user';
import { hashPassword } from 'src/common/utils/shared/hashPassword';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserDataService {
  constructor(private prisma: PrismaService) {}

  async create(data: IUser) {
    const hashedPassword = await hashPassword(data.password);

    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
  }
}
