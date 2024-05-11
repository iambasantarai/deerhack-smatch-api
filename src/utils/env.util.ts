import { config } from 'dotenv';

config();

export const port = process.env.PORT;
export const env = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
};
