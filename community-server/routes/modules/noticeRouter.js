const notice = require("../../router_handler/notice/service");
const router = require('koa-router')();

// 引入处理图片的包
const multer = require('@koa/multer');
// 图片存储位置，图片名字的配置
let storage = multer.diskStorage({
    destination: function(req,file,cb){
      cb(null,__dirname+'/../../public/upload/notice')
    },
    filename: function (req, file, cb) {
      let fileFormat = (file.originalname).split(".");
      cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
// 实例化配置
let upload = multer({ storage });
// 以中间件的方式拦截具有图片信息的请求
router.post('/updateNPic', upload.fields([
  {
    name: 'file',
    maxCount: 4
  },
]), notice['updateNPic']);


router.prefix("/private");
router.post('/insertNotice', notice['insertNotice']);
router.post('/updateNotice', notice['updateNotice']);
router.post('/updateNStatus', notice['updateNStatus'])
router.post('/deleteNotice', notice['deleteNotice'])
router.get('/getNotice', notice['getNotice'])

  
module.exports = router;