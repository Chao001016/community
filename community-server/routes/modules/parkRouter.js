const park = require("../../router_handler/park/service");
const router = require('koa-router')();
router.prefix("/private");
router.post('/updatePark', park['updatePark']);
router.post('/updatePStatus', park['updatePStatus'])
router.get('/getPark', park['getPark']),
router.get('/getMySeat', park['getMySeat']),
router.get('/getAllPark', park['getAllPark'])
router.post('/addSpot', park['addSpot'])
router.delete('/deleteSeatBySpot', park['deleteSeatBySpot'])
router.delete('/deleteParkByPid', park['deleteParkByPid'])
router.post('/addSeat', park['addSeat'])

  
module.exports = router;