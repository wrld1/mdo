import { CompanyTypeEnum } from 'src/common/enums/CompanyType';

export interface IUserCompany {
  userId: number;
  companyId: number;
}

export interface IUserCompanyPagination {
  page?: number;
  limit?: number;
  type?: CompanyTypeEnum;
}
