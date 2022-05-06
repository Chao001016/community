const alipay = require("../../router_handler/alipay/service");
const router = require('koa-router')();
router.post('/private/pay', alipay['pay']);
router.post('/private/queryOrder', alipay['queryOrder'])
router.post('/private/transfer', alipay['transfer'])
module.exports = router;