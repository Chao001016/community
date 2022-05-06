const addr = require("../../router_handler/addr/service");
const router = require('koa-router')();
router.prefix("/private");
router.post('/insertAddr', addr['insertAddr']);
router.get('/getAddr', addr['getAddr']);
router.post('/updateAddr', addr['updateAddr']);
router.post('/deleteAddr', addr['deleteAddr']);
module.exports = router;