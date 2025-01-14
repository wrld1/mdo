import { Company, User } from '@prisma/client';
import { Dwelling } from './dwelling';
import { UserResponse } from './user';

export interface Order {
  id: number;
  name: string;
  description: string;
  objectId: string;
  object: Object;
  dwellingId?: number;
  dwelling?: Dwelling;
  createdAt: Date;
  updatedAt: Date;
  userId?: number;
  user?: User;
  companyId: string;
  company: Company;
  responsibleUserId?: number;
  responsibleUser?: UserResponse;
}

export interface OrderResponse {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  status: string;
  responsibleUser?: UserResponse;
}
