const account = require("../../router_handler/account/service");
//导入数据校验中间件
const { genValidator } = require('../../middleware/validator');
//导入具体校验函数
const { accountValidate } = require('../../validator/account')
const router = require('koa-router')();
const multer = require('@koa/multer');
let storage = multer.diskStorage({
    destination: function(req,file,cb){
      cb(null,__dirname+'/../../public/upload/user_pic')
    },
    filename: function (req, file, cb) {
      let fileFormat = (file.originalname).split(".");
      cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
let upload = multer({ storage });
//登录
router.post('/public/account/login', account['login']);
//注册
router.post('/public/account/registe', account['registe']);
router.get('/public/account/getUserInfo', account['getUserInfo']);
router.get('/private/account/getAllUser', account['getAllUser']);
router.get('/private/account/getPermission', account['getPermission']);
router.post('/public/account/updateUserInfo', upload.fields([
    {
      name: 'file',
      maxCount: 1
    }
  ]), account['updateUserInfo']);
router.get('/public/account/_updateUserInfo', account['_updateUserInfo']);
router.post('/private/account/updatePermission')
module.exports = router;