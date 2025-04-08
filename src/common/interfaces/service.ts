import { DwellingResponse } from './dwelling';
import { ObjectResponse } from './object';

export interface Service {
  name: string;
  description: string;
  price: number;
  logo: string;
  objectId?: string;
}

export interface ServiceResponse {
  id: number;
  name: string;
  description: string;
  price: number | string;
  logo: string;
  objectId?: string;
  object?: ObjectResponse;
  dwellingId?: number;
  dwelling?: DwellingResponse;
}
