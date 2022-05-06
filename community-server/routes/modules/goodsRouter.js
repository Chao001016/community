const goods = require('../../router_handler/goods/service')
const router = require('koa-router')();
const multer = require('@koa/multer');
let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,__dirname+'/../../public/upload/goods_pic')
    },
    filename: function(req, file, cb){
        let fileFormat = (file.originalname).split(".");
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
let upload = multer({ storage })
router.prefix("/private")
router.post('/addGoods', goods['addGoods']);
router.get('/getGoodsByServeId',goods['getGoodsByServeId'])
router.get('/getNotNullGoodsByServeId',goods['getNotNullGoodsByServeId'])
router.post('/updateGoods', goods['updateGoods']);
router.delete('/deleteGoodsByGoodsId', goods['deleteGoodsByGoodsId']);
router.put('/uploadGoodsPicture', upload.fields([
    {
        name: 'file',
        maxCount: 4
    }
]), goods['uploadGoodsPicture']);
router.delete('/deleteCategory', goods['deleteGoodsByCate']);
router.post('/addCategory', goods['addCategory']);
module.exports = router