import dotenv from 'dotenv';

const env = process.env.APP_ENV || process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });
