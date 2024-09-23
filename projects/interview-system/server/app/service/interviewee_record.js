const Service = require('egg').BaseService
const currModelName = 'IntervieweeRecord'
/**
 * 面试记录表  Service
 */
class IntervieweeRecord extends Service {
  get configOption () {
    return {
      include: [
        {
          as: 'interviewee',
          model: this.model.Interviewee,
          attributes: ['id',
            'name',
            'resume_path',
            'email',
            'phone',
            'job_id',
            'address',
            'education',
            'note',
            'type',
            'is_internship',
            'is_success',
            'reason',
            'channel',
            'note']
        }
        // {
        //   as: 'viewr',
        //   model: this.model.Users,
        //   attributes: ['id', 'name']
        // }
      ]
    }
  }

  getAuthWhere () {
    return this.ctx.checkUseAuth(0, false) ? {} : { viewer_id: this._user.id }
  }

  get callBackFn () {
    return (item) => {
      item.intervieweeName = item.interviewee && item.interviewee.dataValues.name
      item.resumePath = item.interviewee && item.interviewee.dataValues.resumePath
      item.intervieweeEmail = item.interviewee && item.interviewee.dataValues.email
      item.intervieweeTel = item.interviewee && item.interviewee.dataValues.phone
      item.jobId = item.interviewee && item.interviewee.dataValues.jobId
      item.address = item.interviewee && item.interviewee.dataValues.address
      item.education = item.interviewee && item.interviewee.dataValues.education
      item.intervieweeType = item.interviewee && item.interviewee.dataValues.type
      item.isInternship = item.interviewee && item.interviewee.dataValues.isInternship
      item.reason = item.interviewee && item.interviewee.dataValues.reason
      item.channel = item.interviewee && item.interviewee.dataValues.channel
      item.intervieweeNote = item.interviewee && item.interviewee.dataValues.note
      item.isSuccess = item.interviewee && item.interviewee.dataValues.isSuccess
      item.interviewee = undefined
      // item.viewerName = item.viewr && item.viewr.dataValues.name
      // item.viewr = undefined
      return item
    }
  }

  async list (configOption = { where: {} }) {
    configOption.where = { ...this.foramtToUnderscoredParams(configOption.where), ...this.getAuthWhere() }
    return await super.findAll({ modelName: currModelName, configOption: { ...this.configOption, ...configOption }, callBackFn: this.callBackFn })
  }

  async findByPk (id, configOption = { where: {} }, needModal) {
    configOption.where = { ...configOption.where, ...this.getAuthWhere() }
    return await super.findByPk({ modelName: currModelName, id, configOption: { ...this.configOption, ...configOption }, needModal, callBackFn: this.callBackFn })
  }

  async update (data, configOption = { where: {} }) {
    configOption.where = { ...configOption.where, ...this.getAuthWhere() }
    return await this.updateData({ modelName: currModelName, data, configOption })
  }

  async destroy () {
    let transaction
    return await this.dealDBFn(async () => {
      transaction = await this.model.transaction()
      const id = this.ctx.params.id
      const intervieweeId = this.ctx.query.intervieweeId
      const configOption = {
        where: { id },
        transaction
      }

      // 删除面试记录
      const res = await this.destroyData({ modelName: currModelName, configOption })

      // 维护候选人记录
      await this.updateModelInterviewee({ viewerId: id, intervieweeId }, transaction)
      await transaction.commit()
      return res
    }, () => transaction.rollback())
  }

  async pagination ({ where, ...otherConfig }) {
    const _t = this
    const { Op } = this.app.Sequelize
    const createdAt = where.createdAt
    const updatedAt = where.updatedAt
    where = { ..._t.foramtToUnderscoredParams(where), ..._t.getAuthWhere() }
    createdAt && (delete where.created_at) && createdAt.length && (where.created_at = {
      [Op.lt]: new Date(createdAt[1]),
      [Op.gt]: new Date(createdAt[0])
    })
    updatedAt && (delete where.updated_at) && updatedAt.length && (where.updated_at = {
      [Op.lt]: new Date(updatedAt[1]),
      [Op.gt]: new Date(updatedAt[0])
    })
    return await super.pagination({ modelName: currModelName, configOption: { ...this.configOption, ...otherConfig, where }, needTranUnder: false, callBackFn: this.callBackFn })
  }

  async create (intervieweeRecordInfo) {
    let transaction
    return await this.dealDBFn(async () => {
      transaction = await this.model.transaction()

      // 新增面试记录
      const currUser = this._user || {}
      !intervieweeRecordInfo.viewerId && (intervieweeRecordInfo.viewerId = currUser.id)
      !intervieweeRecordInfo.viewerName && (intervieweeRecordInfo.viewerName = currUser.name)
      const res = await this.createData({ modelName: currModelName, data: intervieweeRecordInfo, configOption: { transaction } })

      // 维护候选人状态记录
      await this.updateInterviewee(intervieweeRecordInfo, transaction)
      await transaction.commit()
      return res
    }, () => transaction.rollback())
  }

  async updateInterviewee (intervieweeRecordInfo, transaction) {
    const intervieweeInfo = {
      status: intervieweeRecordInfo.stepName,
      viewerId: intervieweeRecordInfo.viewerId,
      viewerName: intervieweeRecordInfo.viewerName,
      isSuccess: intervieweeRecordInfo.isSuccess
    }
    await this.service.interviewee.update(intervieweeInfo, { transaction, where: { id: intervieweeRecordInfo.intervieweeId } }, false)
    return true
  }

  async updateModelInterviewee ({ viewerId, intervieweeId }, transaction) {
    const Interviewee = await this.service.interviewee.findAllByCondtion({ where: { id: intervieweeId, viewer_id: viewerId } }, {}, true)

    await this.service.interviewee.modelUpdateData({
      model: Interviewee,
      data: {
        status: '',
        viewer_id: ''
      },
      configOption: { transaction }
    })
    return true
  }

  /**
   * 判断流程是否存在
   * @return true 表示已存在，false 不存在
   */
  async exist (where) {
    const { Op } = this.app.Sequelize
    // 判断是否已存在
    const configOption = {
      attributes: ['id'],
      where: this.foramtToUnderscoredParams(where)
    }
    where.createdAt && (configOption.where.created_at = {
      [Op.gt]: `${where.createdAt} 00:00:00`,
      [Op.lt]: `${where.createdAt} 23:59:59`
    })
    return !!await super.findOne({ modelName: currModelName, configOption })
  }

  async allProgress (intervieweeId) {
    const configOption = {
      attributes: ['id', 'step', 'step_name', 'comment', 'type', 'viewer_name', 'updated_at'],
      where: {
        interviewee_id: intervieweeId,
        ...this.getAuthWhere()
      }
    }
    return await super.findAll({ modelName: currModelName, configOption })
  }
}

module.exports = IntervieweeRecord
