import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class UpperCaseNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  tableName(className: string, customName: string): string {
    return customName?.toUpperCase() || className.toUpperCase();
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return (customName || propertyName).toUpperCase();
  }
}
