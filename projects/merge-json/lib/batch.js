const fs = require('fs')
const util = require('util')
const { extname, resolve } = require('path')
const read = util.promisify(fs.readFile)
const append = util.promisify(fs.appendFile)
const FSYMBOL = Symbol('files')

class BatcherTool {
  constructor (options) {
    this.dir = options.dir
    this.dest = options.dest
    this.step = options.step || 2
    this.groupIdx = 0
    this.keySet = new Set()
  }

  get files () {
    if (!this[FSYMBOL]) {
      this[FSYMBOL] = fs.readdirSync(this.dir)
        .map(file => resolve(this.dir, file))
        .filter(file => {
          return extname(file) === '.json' && fs.statSync(file).isFile()
        })
    }
    return this[FSYMBOL]
  }

  // 文件分组，如 2 个：[[f1, f2], [f3, f4], []..]
  toGroup () {
    const groups = []

    while (this.files.length) {
      groups.push(this.files.splice(0, this.step))
    }

    return groups
  }

  async mergeData (groups) {
    // 几个 json 文件先合并成一个大 json
    const groupData = groups.reduce((total, data) => {
      for (const key in data) {
        if (!this.keySet.has(key)) {
          this.keySet.add(key)
          total[key] = data[key]
        } else {
          console.log(key, '重复啦')
        }
      }

      return total
    }, {})

    return JSON.stringify(groupData)
  }

  async write (str, groups) {
    str = str.substring(1)
    str = str.substring(0, str.length - 1)

    // 拼接合法的 JSON 格式
    if (this.groupIdx === 0) {
      str = '{' + str + ','
    } else if (this.groupIdx === groups.length - 1) {
      str = str + '}'
    } else {
      str = str + ','
    }

    await append(this.dest, str)
  }

  async getGroupData (groups) {
    return Promise.all(
      groups[this.groupIdx].map(async file => {
        let data = {}
        const text = await read(file)

        try {
          data = JSON.parse(text)
        } catch (err) {
          console.log(err)
        }

        return data
      })
    )
  }

  async merge () {
    const groups = this.toGroup(this.files, this.step)

    while (this.groupIdx < groups.length) {
      const groupData = await this.getGroupData(groups)
      const str = await this.mergeData(groupData)

      await this.write(str, groups)
      this.groupIdx++
    }
  }
}

module.exports = BatcherTool
