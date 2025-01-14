import { CompanyResponse } from './company';
import { DwellingResponse } from './dwelling';

export interface ObjectResponse {
  id: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  company: CompanyResponse;
  dwellings?: DwellingResponse[];
}
