import { Company, User } from '@prisma/client';
import { Dwelling } from './dwelling';
import { UserResponse } from './user';

export type OrderType = 'ELECTRICITY' | 'WATER' | 'GAS' | 'OTHER';

export interface Order {
  name: string;
  type: OrderType;
  description: string;
  objectId: string;
  dwellingId?: number;
  dwelling?: Dwelling;
  userId?: number;
  user?: User;
  companyId: string;
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
