import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Logger,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { KafkaService } from '../services/kafka.service';
import { ElasticsearchService } from '../services/elasticsearch.service';
import { EventDto } from 'src/dto/event.dto';

@Controller('')
export class CollectController {
  private readonly logger = new Logger(CollectController.name);

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly esService: ElasticsearchService,
  ) {}

  @Post('api/collect')
  async postCollect(@Body() collectData: EventDto, @Req() request: Request) {
    this.logger.log(`Received POST request: ${request.url}`);
    this.logger.debug(`Request body: ${JSON.stringify(collectData)}`);
    await this.kafkaService.sendMessage('event-topic', collectData);
    await this.esService.indexDocument('events', collectData);
    return { status: 'success' };
  }

  @Get('api/collect')
  @Get('api/collect.gif')
  async getCollect(@Query() queryData: EventDto, @Req() request: Request) {
    this.logger.log(`Received GET request: ${request.url}`);
    this.logger.debug(`Query parameters: ${JSON.stringify(queryData)}`);
    await this.kafkaService.sendMessage('event-topic', queryData);
    await this.esService.indexDocument('events', queryData);
    return { status: 'success' };
  }
}
