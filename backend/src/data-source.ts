import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'pulse',
  password: 'pulse',
  database: 'pulse',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
