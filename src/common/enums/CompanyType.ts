export const Company = {
  OSBB: 'OSBB',
  ManagingCompany: 'ManagingCompany',
  CottageTown: 'CottageTown',
} as const;

export type CompanyTypeEnum = (typeof Company)[keyof typeof Company];
