import { CompanyTypeEnum } from 'src/common/enums/CompanyType';

export interface ICompany {
  name: string;
  userId?: number;
  type: CompanyTypeEnum;
}
