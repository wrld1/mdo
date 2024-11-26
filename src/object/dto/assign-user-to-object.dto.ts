import { IsNumber, IsPositive } from 'class-validator';

export class AssignUserToObjectDto {
  @IsNumber()
  @IsPositive()
  userId: number;
}
