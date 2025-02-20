import { ObjectResponse } from './object';
import { UserResponse } from './user';

export interface Dwelling {
  id?: number;
  number: number;
  floor?: number;
  entrance?: number;
  objectId: string;
  userId?: number;
}

export interface DwellingResponse {
  id: number;
  name: string;
  number: string;
  floor: number;
  createdAt: Date;
  updatedAt: Date;
  user?: UserResponse;
  object: ObjectResponse;
}
