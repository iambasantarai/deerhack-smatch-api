import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'inPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_COMPANY_KEY = 'inCompany';
export const Company = () => SetMetadata(IS_COMPANY_KEY, true);
