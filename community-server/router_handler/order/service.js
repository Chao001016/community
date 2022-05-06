const db = require('../../db');
const config = require('../../config')
class Service {
    constructor(){

    }
    async insertOrder( ctx ){
        console.log('insertOrder');
        const { serve_id, uid, ocontent, otime, ostatus, type, buyer_info, seller_status } = ctx.request.body;
        let res = await new Promise((resolve, reject) => {
            const sqlInsert = `insert into goodsorder set ?`
            db.query(sqlInsert,{ serve_id, uid, ocontent, otime, ostatus, type, buyer_info, seller_status }, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '插入订单失败'))
                }
                else{
                    resolve(ctx._rtn(0, '插入订单成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async updateOrder( ctx ){
        console.log('updateOrder');
        const { serve_id, uid, ocontent, otime, ostatus, oid} = ctx.request.body;
        let params = {}
        ostatus&&(params.ostatus=ostatus)
        let res = await new Promise((resolve, reject) => {
            const sqlUpdate = `update goodsorder  set ? where oid = ${oid}`
            db.query(sqlUpdate, params, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '更新订单失败'))
                }
                else{
                    resolve(ctx._rtn(0, '更新订单成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async deleteOrder( ctx ){
        console.log('deleteNotice');
        const { oid } = ctx.request.body
        let res = await new Promise((resolve, reject) => {
            const sqlDelete = `delete from goodsorder where oid = ${oid}`
            db.query(sqlDelete, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '删除订单失败'))
                }
                else{
                    resolve(ctx._rtn(0, '删除订单成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async getOrder( ctx ){
        console.log('getNotice');
        const { size, page, uid } = ctx.query
        console.log(size, page, uid);
        let start = (page - 1) * size
        let end =  page * size
        let res = await new Promise((resolve, reject) => {
            const sqlSelect = `select * from goodsorder where uid= ${uid}`
            db.query(sqlSelect, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length === 0){
                    resolve(ctx._rtn(1, '获取订单失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取订单成功', {
                        totalPage: Math.ceil(rst.length / size),
                        totalSize: rst.length,
                        data: rst.slice(start,end)
                    }))
                }
            })
        })
        ctx.body = res
    }
    async updateStar( ctx ){
        console.log('updateOrder');
        const { star, oid } = ctx.request.body;
        let res = await new Promise((resolve, reject) => {
            const sqlUpdate = `update goodsorder set star=${star} where oid=${oid}`
            db.query(sqlUpdate, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '更新评分失败'))
                }
                else{
                    resolve(ctx._rtn(0, '更新评分成功'))
                }
            })
        })
        ctx.body = res
    }
    async getSellerOrder( ctx ){
        console.log('getSellerOrder');
        const { page = 1 , size = 10, uid } = ctx.query
        let start = (page - 1) * size
        let end =  page * size
        let serveIds = await new Promise((resolve, reject)=> {
            const sqlSelect = `select serve_id from service where uid=${uid}`
            db.query(sqlSelect, function(err, rst){
                if(err){
                    resolve(err.message)
                }
                else if(rst.length === 0){
                    
                }
                else{
                    resolve(rst)
                }
            })
        })
        serveIds =  serveIds.map(item => {
            return item.serve_id
        })
        let res = await new Promise((resolve, reject) => {
            const sqlSelect = `select * from goodsorder where serve_id in (?)`
            db.query(sqlSelect, [serveIds], function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length === 0){
                    resolve(ctx._rtn(1, '获取订单失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取订单成功', {
                        totalPage: Math.ceil(rst.length / size),
                        totalSize: rst.length,
                        data: rst.slice(start,end)
                    }))
                }
            })
        })
        ctx.body = res
    }
    async changeSellerState( ctx ) {
        console.log('changeSellerState');
        let { oid, seller_status } = ctx.request.body
        const sqlUpdate = `update goodsorder set seller_status=${seller_status} where oid=${oid}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlUpdate, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '更改商家状态失败'))
                }
                else{
                    resolve(ctx._rtn(0, '更改商家状态成功'))
                }
            })
        })
        ctx.body = res
    }
    
}

module.exports = new Service()