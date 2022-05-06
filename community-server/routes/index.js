const accountRouter = require('./modules/accountRouter');
const shopRouter = require('./modules/shopRouter');
const goodsRouter = require('./modules/goodsRouter');
const noticeRouter = require('./modules/noticeRouter')
const parkRouter = require('./modules/parkRouter');
const magazineRouter = require('./modules/magazineRouter');
const addrRouter = require('./modules/addrRouter')
const alipayRouter = require('./modules/alipayRouter')
const rateRouter = require('./modules/rateRouter')
const orderRouter = require('./modules/orderRouter')
const socket = require('./modules/socket')
function initRouter(app){
  app.use(accountRouter.routes());
  app.use(socket.routes())
  app.use(noticeRouter.routes());
  app.use(parkRouter.routes());
  app.use(magazineRouter.routes());
  app.use(addrRouter.routes());
  app.use(alipayRouter.routes()); // 对支付有关的请求进行处理

  app.use(addrRouter.routes());  // 对收货地址有关的请求进行处理
  app.use(orderRouter.routes()); // 对有关订单请求进行处理
  app.use(rateRouter.routes())   // 对评论进行处理
  app.use(shopRouter.routes());  // 对服务状态的变更进行处理
  app.use(goodsRouter.routes()); // 对服务项目进行处理

}
module.exports = {
  initRouter
}