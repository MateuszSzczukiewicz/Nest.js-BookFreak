import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const env: string = process.env.NODE_ENV || 'development';
const dotenv_path: string = path.resolve(process.cwd(), `.env.${env}`);
const result: dotenv.DotenvConfigOutput = dotenv.config({ path: dotenv_path });
if (result.error) {
  /* do nothing */
}

export class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get<string>('POSTGRES_HOST'),
      port: configService.get<number>('POSTGRES_PORT'),
      username: configService.get<string>('POSTGRES_USER'),
      password: configService.get<string>('POSTGRES_PASSWORD'),
      database: configService.get<string>('POSTGRES_DATABASE'),
      autoLoadEntities: true,
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
        requestCert: true,
      },
      migrationsRun: false,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/database/**/*.entity{.ts,.js}'],
    };
  }
}

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) =>
    TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};

export const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
    requestCert: true,
  },
  migrationsRun: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/**/*.entity{.ts,.js}'],
};

export default new DataSource(dataSourceConfig);
