import { Injectable } from '@nestjs/common';
import { IUser } from 'src/common/interfaces/user';
import { hashPassword } from 'src/common/utils/shared/hashPassword';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserDataService {
  constructor(private prisma: PrismaService) {}

  async create(data: IUser) {
    const hashedPassword = await hashPassword(data.password);

    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOneById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
