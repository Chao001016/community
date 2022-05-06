const magazine = require('../../router_handler/magazine/service')
const router = require('koa-router')();
const multer = require('@koa/multer');
let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,__dirname+'/../../public/upload/magazine')
    },
    filename: function(req, file, cb){
        let fileFormat = (file.originalname).split(".");
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
let upload = multer({ storage })
router.prefix("/private")

router.post('/addMagazine', magazine['addMagazine']);
router.get('/getMagazineCommon',magazine['getMagazineCommon'])
router.get('/getMagazineManage',magazine['getMagazineManage'])
router.post('/updateMagazine', magazine['updateMagazine']);
router.delete('/deleteMagazineByMId', magazine['deleteMagazineByMId']);
router.put('/uploadMagazinePicture', upload.fields([
    {
        name: 'file',
        maxCount: 4
    }
]), magazine['uploadMagazinePicture']);
router.delete('/deleteMagazineByCate', magazine['deleteMagazineByCate']);
router.post('/addMCategory', magazine['addMCategory']);
router.post('/magazineOrder', magazine['magazineOrder']);
module.exports = router