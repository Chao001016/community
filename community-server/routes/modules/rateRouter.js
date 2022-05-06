const rate = require("../../router_handler/rate/service");
const router = require('koa-router')();
const multer = require('@koa/multer');
let storage = multer.diskStorage({
    destination: function(req,file,cb){
      cb(null,__dirname+'/../../public/upload/rate')
    },
    filename: function (req, file, cb) {
      let fileFormat = (file.originalname).split(".");
      cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
let upload = multer({ storage });
router.prefix("/private");
router.post('/insertRate', rate['insertRate']);
router.post('/deleteRate', rate['deleteRate'])
router.get('/getRate', rate['getRate'])
router.post('/updateRPic', upload.fields([
    {
      name: 'file',
      maxCount: 10
    },
  ]), rate['updateRPic']);
  
module.exports = router;