const shop = require("../../router_handler/shop/service");
const router = require('koa-router')();
const multer = require('@koa/multer');
let storageCertificate = multer.diskStorage({
    destination: function(req,file,cb){
      cb(null,__dirname+'/../../public/upload/certificate')
    },
    filename: function (req, file, cb) {
      let fileFormat = (file.originalname).split(".");
      cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
let storageShopPic = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,__dirname+'/../../public/upload/shop_pic')
  },
  filename: function (req, file, cb) {
    let fileFormat = (file.originalname).split(".");
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
let certificate = multer({ storage:storageCertificate });
let shopPic = multer({ storage:storageShopPic });
router.prefix("/private");
router.post('/createShelter',  shop['createShelter']);
router.post('/applyIn', shop['applyIn']);
router.get('/getShopMenu', shop['getShopMenu'])
router.get('/getAuditShop', shop['getAuditShop'])
router.get('/getServiceById', shop['getServiceById'])
router.post('/updateServStatus', shop['updateServStatus'])
router.post('/updateShopInfo', shop['updateShopInfo'])
router.get('/getServeByStatus',shop['getServeByStatus'])
router.post('/uploadCertificate', certificate.fields([
    {
      name: 'file',
      maxCount: 4
    },
    {
      name: 'count',
      maxCount: 1
    }
  ]), shop['certificate']);
  router.post('/updateShopPic', shopPic.fields([
    {
      name: 'file',
      maxCount: 4
    },
    {
      name: 'count',
      maxCount: 1
    }
  ]), shop['updateShopPic']);
module.exports = router;