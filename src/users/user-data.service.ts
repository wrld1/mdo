import { Injectable } from '@nestjs/common';
import { IUser } from 'src/interfaces/user';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'src/utils/shared/hashPassword';

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
