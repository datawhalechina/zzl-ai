
const axios = require('axios')

const get = url => axios.get(url).then(response => response.data)

const post = (url, data) => axios.post(url, data).then(response => response.data)

module.exports = {
  get,
  post,
}
