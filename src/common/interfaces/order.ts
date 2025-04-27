import { User } from '@prisma/client';
import { Dwelling, DwellingResponse } from './dwelling';
import { UserResponse } from './user';
import { Decimal } from '@prisma/client/runtime/library';
import { ObjectResponse } from './object';

export type OrderType =
  | 'ELECTRICITY'
  | 'WATER'
  | 'GAS'
  | 'ORGANIZATION'
  | 'OTHER';
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
  object: ObjectResponse;
  dwelling?: DwellingResponse;
  createdAt: Date;
  type: OrderType;
  user: UserResponse;
  responsibleUser?: UserResponse;
  price?: number;
  orderStatus: OrderStatus;
}

export interface OrderUpdate extends Pick<Order, 'responsibleUserId'> {
  price?: number;
  orderStatus?: OrderStatus;
  description?: string;
}
