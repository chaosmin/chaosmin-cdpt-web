/*
 *读取env环境变量
 */
const fs = require('fs')
const path = require('path')
// env 文件 判断打包环境指定对应的服务器id
const envfile = process.env.NODE_ENV === 'production' ? '../.env.production' : '../.env.development'
// env环境变量的路径
const envPath = path.resolve(__dirname, envfile)
// env对象
const envObj = parse(fs.readFileSync(envPath, 'utf8'))
const SERVER_ID = parseInt(envObj['VUE_APP_SERVER_ID'])

function parse(src) {
  // 解析KEY=VAL的文件
  const res = {}
  src.split('\n').forEach(line => {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    // eslint-disable-next-line no-useless-escape
    const keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]
      let value = keyValueArr[2] || ''

      // expand newlines in quoted values
      const len = value ? value.length : 0
      if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
        value = value.replace(/\\n/gm, '\n')
      }

      // remove any surrounding quotes and extra spaces
      value = value.replace(/(^['"]|['"]$)/g, '').trim()

      res[key] = value
    }
  })
  return res
}

const SERVER_LIST = [
  {
    id: 0,
    name: 'test-environment',
    host: '106.14.40.2',
    port: 22,
    username: 'app',
    password: 'chaosmin-cdpt',
    path: '/home/app/cdpt/front'
  },
  {
    id: 1,
    name: 'prod-environment',
    host: '139.224.211.162',
    port: 22,
    username: 'root',
    password: 'wmylEtVW1G9DaRit',
    path: '/root/service/chaosmin_cdpt/web'
  }
]

module.exports = SERVER_LIST[SERVER_ID]
