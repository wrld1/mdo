import { User } from '@prisma/client';
import { Dwelling } from './dwelling';
import { UserResponse } from './user';
import { Decimal } from '@prisma/client/runtime/library';

export type OrderType = 'ELECTRICITY' | 'WATER' | 'GAS' | 'OTHER';
export type OrderStatus =
  | 'RECEIVED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'BLOCKED'
  | 'INVALID';

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
  price: number;
  orderStatus: OrderStatus;
}

export interface OrderUpdate
  extends Pick<Order, 'responsibleUserId' | 'description'> {
  id: string;
  price?: number;
  orderStatus?: OrderStatus;
}
