const db = require('../../db');
const config = require('../../config')
class Service {
    constructor(){

    }
    async updatePark( ctx ){
        console.log('updateNotice');
        const { pid, seat_number, spot } = ctx.request.body;
        let res = await new Promise((resolve, reject) => {
            const sqlUpdate = `update park  set ? where pid = ${pid}`
            db.query(sqlUpdate,{ seat_number, spot }, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '更新车位失败'))
                }
                else{
                    resolve(ctx._rtn(0, '更新车位成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async deleteParkByPid( ctx ){
        console.log('deleteNotice');
        const { pid } =  ctx.query
        let res = await new Promise((resolve, reject) => {
            const sqlDelete = `delete from park where pid = ${pid}`
            db.query(sqlDelete, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '删除车位失败'))
                }
                else{
                    resolve(ctx._rtn(0, '删除车位成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async getPark( ctx ) {
        console.log('getPark');
        let { size, page } = ctx.query
        let start = (page - 1) * size
        let end =  page * size
        let res = await new Promise((resolve, reject) => {
            const sqlSelect = `select * from park`
            db.query(sqlSelect, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length === 0){
                    resolve(ctx._rtn(1, '获取车位失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取车位成功', {
                        totalPage: Math.ceil(rst.length / size),
                        totalSize: rst.length,
                        data: rst.slice(start,end)
                    }))
                }
            })
        })
        ctx.body = res
    }
    async getAllPark( ctx ) {
        console.log('getAllPark');
        let res = await new Promise((resolve, reject) => {
            const sqlSelect = `select * from park`
            db.query(sqlSelect, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.length < 0){
                    resolve(ctx._rtn(1, '获取车位失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取车位成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async updatePStatus( ctx ){
        console.log('updateNStatus');
        let { uid, pstatus, pid, start_date, end_date } = ctx.request.body
        // console.log(pstatus);
        let res1;
        if(pstatus == 1) {
            let sqlSelect = `select pstatus from park where pid=${pid}`
            res1 = await new Promise((resolve, reject) => {
                db.query(sqlSelect, function(err, rst){
                    if(err){
                        resolve(ctx._rtn(1 ,err.message))
                    }
                    else if(rst.length !== 1){
                        resolve(ctx._rtn(1, '更新状态失败'))
                    }
                    else{
                        resolve(ctx._rtn(0, '更新状态成功',rst[0]))
                    }
                })
            })
            if(res1.data.pstatus == 1){
                ctx.body = ctx._rtn(3, '车位已被占用')
                return
            }
        }
        let sqlUpdate = `update park set ? where pid=${pid}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlUpdate, { uid, pstatus, start_date, end_date }, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '更新状态失败'))
                }
                else{
                    resolve(ctx._rtn(0, '更新状态成功'))
                }
            })
        })
        ctx.body = res
    }
    async addSpot( ctx ){
        //入参 
        console.log('addSpot');
        const { spot } = ctx.request.body
        const spot_id = parseInt(Date.now().toString().substr(0,10))
        const sqlInsert = `insert into park set ?`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlInsert, { spot, spot_id }, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '增加地点失败'))
                }
                else{
                    resolve(ctx._rtn(0, '增加地点成功',{
                        pid: rst.insertId,
                        spot_id
                    }))
                }
            })
        })
        ctx.body = res;
    }
    async deleteSeatBySpot( ctx ){
        // 入参： spot名称
        console.log('deleteGoodsByCate');
        const { spot } = ctx.query;
        let res = await new Promise((resolve, reject) => {
            const sqlDelete = `delete from park where spot=?`
            db.query(sqlDelete, [spot], function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.affectedRows === 0){
                    resolve(ctx._rtn(1, '删除地点失败！'))
                }
                else{
                    resolve(ctx._rtn(0, '删除地点成功！'))
                }
            })
        })
        ctx.body = res
    }
    async addSeat( ctx ) {
        console.log('addSeat');
        const { spot, spot_id } = ctx.request.body
        const sqlInsert = `insert into park set ?`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlInsert, {spot, spot_id }, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '增加车位失败'))
                }
                else{
                    resolve(ctx._rtn(0, '增加车位成功',{
                        pid: rst.insertId,
                    }))
                }
            })
        })
        ctx.body = res;
    }
    async getMySeat( ctx ) {
        console.log('getMySeat');
        let { uid } = ctx.query
        let res = await new Promise((resolve, reject) => {
            const sqlSelect = `select * from park where uid=${uid}`
            db.query(sqlSelect, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length < 0){
                    resolve(ctx._rtn(1, '获取车位失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取车位成功', rst[0]))
                }
            })
        })
        ctx.body = res
    }
}

module.exports = new Service()