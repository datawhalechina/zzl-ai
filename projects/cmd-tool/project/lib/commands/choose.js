const inquirer = require('inquirer')?.default

module.exports = (list) => inquirer.prompt([{
  type: 'list',
  name: 'result',
  message: '共有 ' + list.length + ' 个结果, 按下回车下载文档',
  choices: list.map((i, index) => names(i, index))
}])


const names = (item, index) =>
  `${index + 1}. [${item.name}] `
