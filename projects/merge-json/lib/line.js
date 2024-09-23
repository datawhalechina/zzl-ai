const { readFileSync, readdirSync, statSync, createWriteStream } = require('fs')
const { extname, resolve } = require('path')
const renderFile = path => JSON.parse(readFileSync(path, 'utf8'))
const FSYMBOL = Symbol('files')

class LineTool {
  constructor (options) {
    this.dir = options.dir
    this.dest = options.dest
    this.keySet = new Set()
    this.rs = createWriteStream(this.dest)
  }

  get files () {
    if (!this[FSYMBOL]) {
      this[FSYMBOL] = readdirSync(this.dir)
        .map(file => resolve(this.dir, file))
        .filter(file => {
          return extname(file) === '.json' && statSync(file).isFile()
        })
    }
    return this[FSYMBOL]
  }

  writeToStream (data, isLastFile) {
    if (Array.isArray(data)) {
      return data.forEach(data => this.writeToStream(data, this.keySet, this.rs))
    }

    const keys = Object.keys(data)

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i]
      const isLastKey = (i === keys.length - 1)
      const comma = (isLastFile && isLastKey) ? '' : ','

      if (!this.keySet.has(key)) {
        this.keySet.add(key)
        this.rs.write(`"${key}": ${JSON.stringify(data[key])}${comma}\n`)
      } else {
        console.log(key, '重复啦')
      }
    }
  }

  merge () {
    this.rs.write('{\n')

    for (let i = 0; i < this.files.length; ++i) {
      const data = renderFile(this.files[i])
      const isLastFile = (i === this.files.length - 1)

      this.writeToStream(data, isLastFile)
    }

    this.rs.write('}')
    this.rs.end()
  }
}

module.exports = LineTool
