import { Test, TestingModule } from '@nestjs/testing';
import { ResponseSchemaService } from '../services/responseScheme.service';
import { MongoRepository } from 'typeorm';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { mockResponseSchema } from './mockResponseSchema';
import { getRepositoryToken } from '@nestjs/typeorm';
import { cloneDeep } from 'lodash';

describe('ResponseSchemaService', () => {
  let service: ResponseSchemaService;
  let responseSchemaRepository: MongoRepository<ResponseSchema>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponseSchemaService,
        {
          provide: getRepositoryToken(ResponseSchema),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockResponseSchema),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ResponseSchemaService>(ResponseSchemaService);
    responseSchemaRepository = module.get<MongoRepository<ResponseSchema>>(
      getRepositoryToken(ResponseSchema),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publishResponseSchema', () => {
    it('should update existing response schema', async () => {
      jest
        .spyOn(responseSchemaRepository, 'save')
        .mockResolvedValueOnce(undefined);

      const params = {
        title: 'testTitle',
        surveyPath: mockResponseSchema.surveyPath,
        code: {},
        pageId: mockResponseSchema.pageId,
      };

      await service.publishResponseSchema(params);

      expect(responseSchemaRepository.findOne).toHaveBeenCalledWith({
        where: {
          surveyPath: params.surveyPath,
        },
      });
      expect(responseSchemaRepository.create).toHaveBeenCalledTimes(0);
      expect(responseSchemaRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should create new response schema if not exists', async () => {
      jest
        .spyOn(responseSchemaRepository, 'findOne')
        .mockResolvedValueOnce(null);
      const params = {
        title: 'testTitle',
        surveyPath: mockResponseSchema.surveyPath,
        code: {},
        pageId: mockResponseSchema.pageId,
      };
      await service.publishResponseSchema(params);

      expect(responseSchemaRepository.findOne).toHaveBeenCalledWith({
        where: {
          surveyPath: params.surveyPath,
        },
      });
      expect(responseSchemaRepository.create).toHaveBeenCalledTimes(1);
      expect(responseSchemaRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('getResponseSchemaByPath', () => {
    it('should return response schema by survey path', async () => {
      jest
        .spyOn(responseSchemaRepository, 'findOne')
        .mockResolvedValueOnce(mockResponseSchema);

      const result = await service.getResponseSchemaByPath(
        mockResponseSchema.surveyPath,
      );

      expect(result).toEqual(mockResponseSchema);
      expect(responseSchemaRepository.findOne).toHaveBeenCalledWith({
        where: {
          surveyPath: mockResponseSchema.surveyPath,
        },
      });
    });
  });

  describe('getResponseSchemaByPageId', () => {
    it('should return response schema by page ID', async () => {
      jest
        .spyOn(responseSchemaRepository, 'findOne')
        .mockResolvedValueOnce(mockResponseSchema);

      const result = await service.getResponseSchemaByPageId(
        mockResponseSchema.pageId,
      );

      expect(result).toEqual(mockResponseSchema);
      expect(responseSchemaRepository.findOne).toHaveBeenCalledWith({
        where: { pageId: mockResponseSchema.pageId },
      });
    });
  });

  describe('deleteResponseSchema', () => {
    it('should delete response schema by survey path', async () => {
      jest
        .spyOn(responseSchemaRepository, 'findOne')
        .mockResolvedValueOnce(cloneDeep(mockResponseSchema));
      jest
        .spyOn(responseSchemaRepository, 'save')
        .mockResolvedValueOnce(undefined);

      await service.deleteResponseSchema({
        surveyPath: mockResponseSchema.surveyPath,
      });

      expect(responseSchemaRepository.findOne).toHaveBeenCalledWith({
        where: {
          surveyPath: mockResponseSchema.surveyPath,
        },
      });
      expect(responseSchemaRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
