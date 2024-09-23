import {
  IsString,
  IsOptional,
  IsIP,
  IsIn,
  IsDateString,
} from 'class-validator';

export class EventDto {
  @IsDateString()
  timestamp: string;

  @IsString()
  @IsIn(['error', 'warn', 'info'])
  level: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  stack?: string;

  @IsString()
  url: string;

  @IsString()
  userAgent: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsIP()
  ip: string;

  @IsString()
  deviceType: string;

  @IsString()
  os: string;

  @IsString()
  browser: string;

  @IsString()
  network: string;

  @IsString()
  appVersion: string;

  @IsOptional()
  customData?: object;
}
