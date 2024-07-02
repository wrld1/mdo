export const Company = {
  OSBB: 'OSBB',
  ManagingCompany: 'ManagingCompany',
  CottageTown: 'CottageTown',
} as const;

export type CompanyType = (typeof Company)[keyof typeof Company];
