import { CompanyType } from 'src/enums/CompanyType';

export interface ICompany {
  name: string;
  userId?: number;
  type: CompanyType;
}
