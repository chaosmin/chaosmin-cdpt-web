const scpClient = require('scp2')
const ora = require('ora')
const chalk = require('chalk')
const server = require('./products')
const spinner = ora('正在发布到' + (process.env.NODE_ENV === 'production' ? '生产' : '测试') + '服务器...')

const Client = require('ssh2').Client
const conn = new Client()
conn.on('ready', function() {
  conn.exec('ls', function(err, stream) {
    if (err) throw err
    stream.on('close', function(code, signal) {
      // 在执行shell命令后，把开始上传部署项目代码放到这里面
      spinner.start()
      scpClient.scp('./dist', {
        host: server.host,
        port: server.port,
        username: server.username,
        password: server.password,
        path: server.path
      },
      function(err) {
        spinner.stop()
        if (err) {
          console.log(chalk.red('发布失败.\n'))
          throw err
        } else {
          console.log(chalk.green('Success! 成功发布到' + (process.env.NODE_ENV === 'production' ? '生产' : '测试') + '服务器! \n'))
        }
      })
      conn.end()
    }).on('data', function(data) {
      console.log('STDOUT: ' + data)
    }).stderr.on('data', function(data) {
      console.log('STDERR: ' + data)
    })
  })
}).connect({
  host: server.host,
  port: server.port,
  username: server.username,
  password: server.password
})
