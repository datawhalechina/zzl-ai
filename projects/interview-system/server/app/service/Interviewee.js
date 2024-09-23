const Service = require('egg').BaseService
const fs = require('fs')
const path = require('path')

const currModelName = 'Interviewee'
/**
 * 候选人表  Service
 */
class Interviewee extends Service {
  get configOption () {
    return {
      include: [
        {
          as: 'recommender',
          model: this.model.Users,
          attributes: ['name']
        },
        {
          as: 'job',
          model: this.model.Job,
          attributes: ['name']
        }
      ],
      where: this.getAuthWhere()
    }
  }

  get callBackFn () {
    return (item) => {
      item.jobName = item.job && item.job.dataValues.name
      item.job = undefined
      // item.viewerName = item.viewr && item.viewr.dataValues.name
      // item.viewr = undefined
      item.recommenderName = item.recommender && item.recommender.dataValues.name
      item.recommender = undefined
      return item
    }
  }

  getAuthWhere () {
    return this.ctx.checkUseAuth(0, false) ? {} : { recommender_id: this._user.id }
  }

  async list () {
    return await super.findAll({ modelName: currModelName, configOption: this.configOption, callBackFn: this.callBackFn })
  }

  async findByPk (id, configOption, needModal) {
    configOption = { ...this.configOption, ...configOption }
    configOption.where.id = id
    this.ctx.checkUseAuth(1) && delete configOption.where.recommender_id
    return await super.findOne({ modelName: currModelName, configOption, needModal, callBackFn: this.callBackFn })
  }

  async create (intervieweeInfo, file) {
    return await this.dealDBFn(async () => {
      const filename = `${intervieweeInfo.name}-${intervieweeInfo.phone}`
      const uploadRes = await this.uploadPdf(this.ctx.origin, file, filename)
      intervieweeInfo.resumePath = uploadRes.resumePath

      // 新增候选人记录
      const currUser = this._user || {}
      intervieweeInfo.recommenderId = currUser.id || 1
      return await this.createData({ modelName: currModelName, data: intervieweeInfo })
    })
  }

  async update (data, configOption, needJoin = true) {
    needJoin && (configOption = { ...this.configOption, ...configOption })
    let callBackFn = ''
    needJoin && (callBackFn = this.callBackFn)
    return await this.updateData({ modelName: currModelName, data, configOption, callBackFn })
  }

  async modelUpdate (model, data, configOption = {}) {
    let transaction
    return await this.dealDBFn(async () => {
      transaction = await this.model.transaction()
      configOption.transaction = transaction
      const res = await super.modelUpdateData({ model, data, configOption })

      // 维护推荐记录
      recommendRecordInfo.id = res.recommenderId
      recommendRecordInfo.intervieweeName = res.name
      recommendRecordInfo.intervieweeTel = res.phone
      recommendRecordInfo.intervieweeType = res.type
      await this.service.recommendRecord.update(recommendRecordInfo, { transaction }, false)
      await transaction.commit()
      return res
    }, () => transaction.rollback())
  }

  async destroy () {
    let transaction
    return await this.dealDBFn(async () => {
      transaction = await this.model.transaction()
      const id = this.ctx.params.id
      let recommenderId = ''
      this.ctx.checkUseAuth(0) && (recommenderId = this._user.id)
      const configOption = {
        where: { id, recommender_id: recommenderId },
        transaction
      }
      // 查找候选人记录
      let res = await this.exist(configOption.where)
      if (!res) {
        return this.ctx.failMsg(`${currModelName} 表内无标识为 ${id} 的记录`)
      }
      // 删除候选人记录
      res = await this.destroyData({ modelName: currModelName, configOption })
      // 删除推荐记录
      const recommendRecordWhere = {
        interviewee_id: id,
        recommender_user_id: recommenderId
      }

      await this.service.recommendRecord.destroy({ transaction, where: recommendRecordWhere })
      await transaction.commit()
      return res
    }, () => transaction.rollback())
  }

  /**
   * 上传简历
   * @returns {string} res 上传路径
   */
  async uploadPdf (origin, stream, filename) {
    const resumeFolderPath = `public/${this.formatDay()}`
    const saveFolder = `app/${resumeFolderPath}`
    const resumePath = `${resumeFolderPath}/${filename}.pdf`
    // 如果文件夹不存在，则直接创建
    if (!fs.existsSync(saveFolder)) {
      fs.mkdirSync(saveFolder)
    }
    const writerStream = fs.createWriteStream(path.join(this.config.baseDir, `${saveFolder}/${filename}.pdf`))
    await stream.pipe(writerStream)
    return { resumePath, uploadPath: `${origin}${resumePath}` }
  }

  async pagination ({ where, ...otherConfig }) {
    const _t = this
    const { Op } = this.app.Sequelize
    const { createdAt } = where
    where = _t.foramtToUnderscoredParams({ ...where, ..._t.configOption.where })
    createdAt && (delete where.created_at) && createdAt.length && (where.created_at = {
      [Op.lt]: new Date(createdAt[1]),
      [Op.gt]: new Date(createdAt[0])
    })

    // [Op.like]: '%hat',
    return await super.pagination({ modelName: currModelName, configOption: { ...otherConfig, ..._t.configOption, where }, needTranUnder: false, callBackFn: this.callBackFn })
  }

  async findAllByCondtion (configOption, needJoin = true) {
    needJoin && (configOption = { ...this.configOption, ...configOption })
    let callBackFn = ''
    needJoin && (callBackFn = this.callBackFn)
    return await this.findAll({ modelName: currModelName, configOption, callBackFn })
  }

  /**
   * 判断简历是否存在
   * @return true 表示已存在，false 不存在
   */
  async exist (where) {
    // 判断是否已存在
    const configOption = {
      attributes: ['id'],
      where: this.foramtToUnderscoredParams(where)
    }
    return !!await super.findOne({ modelName: currModelName, configOption })
  }
}

module.exports = Interviewee
