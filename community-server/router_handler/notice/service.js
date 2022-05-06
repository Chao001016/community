const db = require('../../db');
const config = require('../../config')
class Service {
    constructor(){

    }
    async insertNotice( ctx ){
        console.log('insertNotice');
        const { publisher, ncontent, time, receiver, nstatus, title } = ctx.request.body;
        let res = await new Promise((resolve, reject) => {
            const sqlInsert = `insert into notice set ?`
            db.query(sqlInsert,{ publisher, ncontent, time, receiver, nstatus, title }, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '插入通知失败'))
                }
                else{
                    resolve(ctx._rtn(0, '插入通知成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async updateNotice( ctx ){
        console.log('updateNotice');
        const { nid, publisher, ncontent, time, receiver, nstatus,title } = ctx.request.body;
        let res = await new Promise((resolve, reject) => {
            const sqlUpdate = `update notice  set ? where nid = ${nid}`
            db.query(sqlUpdate,{ publisher, ncontent, time, receiver, nstatus,title }, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '更新通知失败'))
                }
                else{
                    resolve(ctx._rtn(0, '更新通知成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async deleteNotice( ctx ){
        console.log('deleteNotice');
        const { nid } = ctx.request.body
        let res = await new Promise((resolve, reject) => {
            const sqlDelete = `delete from notice where nid = ${nid}`
            db.query(sqlDelete, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '删除通知失败'))
                }
                else{
                    resolve(ctx._rtn(0, '删除通知成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async getNotice( ctx ){
        console.log('getNotice');
        let { user_type = 3 } = ctx.query
        let sqlSelect = `select * from notice`
        if(user_type != 3){
            sqlSelect = `select * from notice where receiver = ${user_type}`
        }
        let res = await new Promise((resolve, reject) => {
            db.query(sqlSelect, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length === 0){
                    resolve(ctx._rtn(1, '获取通知失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取通知成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async updateNPic ( ctx ) {
        console.log('updatePic');
        let filePath =  []
        let { nid } = ctx.request.body;
        for(let file of ctx.request.files.file){
            console.log(file);
            let index = file.path.indexOf('\\upload')
            filePath.push(file.path.slice(index));
        }
        //图片路径入库
        let res = await new Promise((resolve, reject) => {
            const sqlUpdate = `update notice set npic=? where nid=?`;
            db.query(sqlUpdate, [filePath.join(','), nid], function(err, rst){
                if(err){
                    resolve({
                        status: 1,
                        message: err,
                    })
                    return
                }
                else if(rst.affectedRows !== 1){
                    resolve({
                        status: 1,
                        message: '上传图片失败！'
                    })
                    return
                }
                else{
                    resolve({
                        status: 0,
                        message: '上传图片成功'
                    })
                }
            })
        })
        ctx.body = res
    }
    async updateNStatus( ctx ){
        console.log('updateNStatus');
        let { nid, nstatus } = ctx.request.body
        const sqlUpdate = `update notice set nstatus=${nstatus} where nid=${nid}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlUpdate, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '取消发布失败'))
                }
                else{
                    resolve(ctx._rtn(0, '取消发布成功'))
                }
            })
        })
        console.log(res);
        ctx.body = res
    }
    
}

module.exports = new Service()