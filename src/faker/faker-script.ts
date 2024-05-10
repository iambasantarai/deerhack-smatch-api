import { faker } from '@faker-js/faker';
import { Company, Industry } from 'src/app/company/entities/company.entity';

export async function generateCompanyData(): Promise<Company> {
  const company = new Company();
  company.name = faker.company.name();
  company.description = faker.lorem.sentence();
  company.password = faker.internet.password();
  company.address = faker.address.streetAddress();
  company.website = faker.internet.url();
  company.socials = {
    twitter: faker.internet.url(),
    facebook: faker.internet.url(),
    // Add more socials as needed
  };
  company.logo = faker.image.avatar();
  company.founded = faker.date.past().toISOString();
  company.employeeNumber = faker.phone.number();
  company.phone = faker.phone.number();
  company.hrName = faker.name.fullName();
  company.hrEmail = faker.internet.email();
  company.industry = faker.helpers.enumValue(Industry);

  return company;
}
