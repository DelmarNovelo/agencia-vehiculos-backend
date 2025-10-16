import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { UpperCaseNamingStrategy } from "./uppercase-naming-strategy.config";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'oracle',
  host: 'localhost',
  port: 1521,
  username: 'jefri',
  password: 'jefri123',
  database: 'agencia_vehiculos',
  serviceName: 'XEPDB1',
  synchronize: true,
  autoLoadEntities: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  namingStrategy: new UpperCaseNamingStrategy(),
};