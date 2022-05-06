const db = require('../../db');
const config = require('../../config')
class Service {
    constructor(){

    }
    async insertAddr( ctx ) {
        const { name, phone, addr, detailaddr, uid, isDefault } = ctx.request.body;
        let res = await new Promise((resolve, reject) => {
            const sqlInsert = `insert into fetchaddr  set ?`
            db.query(sqlInsert,{ name, phone, addr, detailaddr, uid, isDefault }, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '插入收货地址失败'))
                }
                else{
                    resolve(ctx._rtn(0, '插入收货地址成功'))
                }
            })
        })
        ctx.body = res
    }
    async updateAddr( ctx ) {
        const { aid, name, phone, addr, detailaddr, uid } = ctx.request.body;
        let res = await new Promise((resolve, reject) => {
            const sqlUpdate = `update fetchaddr  set ? where aid = ${aid}`
            db.query(sqlUpdate, { name, phone, addr, detailaddr, uid }, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '更新收货地址失败'))
                }
                else{
                    resolve(ctx._rtn(0, '更新收货地址成功'))
                }
            })
        })
        ctx.body = res
    }
    async getAddr( ctx ) {
        const { uid } = ctx.query;
        let res = await new Promise((resolve, reject) => {
            const sqlUpdate = `select * from fetchaddr where uid = ${uid}`
            db.query(sqlUpdate, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length <= 0){
                    resolve(ctx._rtn(1, '获取收货地址失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取收货地址成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async deleteAddr ( ctx ) {
        const { aid } = ctx.request.body;
        let res = await new Promise((resolve, reject) => {
            const sqlDelete = `delete from fetchaddr where aid = ${aid}`
            db.query(sqlDelete, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '删除收货地址失败'))
                }
                else{
                    resolve(ctx._rtn(0, '删除收货地址成功'))
                }
            })
        })
        ctx.body = res
    }
}

module.exports = new Service()