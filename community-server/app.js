const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require("@koa/cors")
const jwt = require('jsonwebtoken')
const jwtKoa = require('koa-jwt');
const util = require('util')
const verify = util.promisify(jwt.verify)
const router = require('./routes/index')
//导入配置文件
const config = require('./config');



// error handler
onerror(app)

// middlewares
app.use(cors())
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
//自定义中间件全局配置
app.use(async (ctx,next) => {
  //封装返回信息
  ctx['_rtn'] = (status, message, data) => {
    return {
      status,
      message,
      data
    }
  }
  await next()
})
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
//验证token
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Credentials','true'); // 新增
  console.log('验证token');
  if(/^\/public|\/socket.io/g.test(ctx.url)){
    await next()
  }
  else{
    const token = String(ctx.headers.authorization)
    let decodedToken = await verify(token.split(' ')[1], config.jwtSecretKey).catch(err => {
      ctx._verify = false
    });
    if(ctx._verify === false){
      ctx.body = ctx._rtn(2,'token 验证失败')
      return
    }
    ctx._userInfo = decodedToken
    await next()
  }
});

// routes
router.initRouter(app)

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
module.exports = app
