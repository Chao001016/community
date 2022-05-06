const order = require("../../router_handler/order/service");
const router = require('koa-router')();

router.prefix("/private");
router.post('/insertOrder', order['insertOrder']);
router.post('/updateOrder', order['updateOrder']);
router.post('/updateStar', order['updateStar']);
router.post('/deleteOrder', order['deleteOrder'])
router.post('/changeSellerState', order['changeSellerState'])
router.get('/getOrder', order['getOrder'])
router.get('/getSellerOrder', order['getSellerOrder'])

module.exports = router;