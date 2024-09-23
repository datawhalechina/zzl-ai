import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectController } from './controllers/collect.controller';
import { ElasticsearchService } from './services/elasticsearch.service';
import { KafkaService } from './services/kafka.service';

@Module({
  imports: [ConfigModule.forRoot({})],
  controllers: [AppController, CollectController],
  providers: [
    AppService,
    ElasticsearchService,
    KafkaService,
    ConfigService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
