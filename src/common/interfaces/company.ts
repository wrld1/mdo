import { CompanyTypeEnum } from 'src/common/enums/CompanyType';
import { ObjectResponse } from './object';
import { UserResponse } from './user';

export interface ICompany {
  name?: string;
  code: number;
  userId?: number;
  type: CompanyTypeEnum;
}

export interface CompanyResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  objects?: ObjectResponse[];
  users?: UserResponse[];
}
