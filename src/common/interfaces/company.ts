import { CompanyTypeEnum } from 'src/common/enums/CompanyType';

export interface ICompany {
  name?: string;
  code: number;
  userId?: number;
  type: CompanyTypeEnum;
}
