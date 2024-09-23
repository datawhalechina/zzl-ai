import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService {
  private readonly client = new Client({
    node: process.env.ELASTICSEARCH_HOST,
  });

  async indexDocument(index: string, document: any) {
    await this.client.index(
      {
        index,
        body: document,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
