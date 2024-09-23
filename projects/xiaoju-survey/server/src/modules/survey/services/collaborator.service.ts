import { Injectable } from '@nestjs/common';
import { Collaborator } from 'src/models/collaborator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Logger } from 'src/logger';

@Injectable()
export class CollaboratorService {
  constructor(
    @InjectRepository(Collaborator)
    private readonly collaboratorRepository: MongoRepository<Collaborator>,
    private readonly logger: Logger,
  ) {}

  async create({ surveyId, userId, permissions }) {
    const collaborator = this.collaboratorRepository.create({
      surveyId,
      userId,
      permissions,
    });
    return this.collaboratorRepository.save(collaborator);
  }

  async batchCreate({ surveyId, collaboratorList }) {
    const res = await this.collaboratorRepository.insertMany(
      collaboratorList.map((item) => {
        return {
          ...item,
          surveyId,
        };
      }),
    );
    return res;
  }

  async getSurveyCollaboratorList({ surveyId }) {
    const list = await this.collaboratorRepository.find({
      surveyId,
    });
    return list;
  }

  async getCollaboratorListByIds({ idList }) {
    const list = await this.collaboratorRepository.find({
      _id: {
        $in: idList.map((item) => new ObjectId(item)),
      },
    });
    return list;
  }

  async getCollaborator({ userId, surveyId }) {
    const info = await this.collaboratorRepository.findOne({
      where: {
        surveyId,
        userId,
      },
    });
    return info;
  }

  async changeUserPermission({ userId, surveyId, permission }) {
    const updateRes = await this.collaboratorRepository.updateOne(
      {
        surveyId,
        userId,
      },
      {
        $set: {
          permission,
        },
      },
    );
    return updateRes;
  }

  async deleteCollaborator({ userId, surveyId }) {
    const delRes = await this.collaboratorRepository.deleteOne({
      userId,
      surveyId,
    });
    return delRes;
  }

  async batchDelete({
    idList,
    neIdList,
    userIdList,
    surveyId,
  }: {
    idList?: Array<string>;
    neIdList?: Array<string>;
    userIdList?: Array<string>;
    surveyId: string;
  }) {
    const query: Record<string, any> = {
      surveyId,
      $or: [],
    };

    if (Array.isArray(userIdList) && userIdList.length > 0) {
      query.$or.push({
        userId: {
          $in: userIdList,
        },
      });
    }

    if (
      (Array.isArray(idList) && idList.length > 0) ||
      (Array.isArray(neIdList) && neIdList.length > 0)
    ) {
      const idQuery: Record<string, any> = {
        _id: {},
      };
      if (idList && idList.length > 0) {
        idQuery._id.$in = idList.map((item) => new ObjectId(item));
      }
      if (neIdList && neIdList.length > 0) {
        idQuery._id.$nin = neIdList.map((item) => new ObjectId(item));
      }
      query.$or.push(idQuery);
    }
    this.logger.info(JSON.stringify(query));
    const delRes = await this.collaboratorRepository.deleteMany(query);
    return delRes;
  }

  async batchDeleteBySurveyId(surveyId) {
    const delRes = await this.collaboratorRepository.deleteMany({
      surveyId,
    });
    return delRes;
  }

  updateById({ collaboratorId, permissions }) {
    return this.collaboratorRepository.updateOne(
      {
        _id: new ObjectId(collaboratorId),
      },
      {
        $set: {
          permissions,
        },
      },
    );
  }

  getCollaboratorListByUserId({ userId }) {
    return this.collaboratorRepository.find({
      where: {
        userId,
      },
    });
  }
}
