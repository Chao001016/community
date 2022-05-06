const db = require('../../db');
const config = require('../../config')
class Service {
    constructor(){

    }
    async insertRate( ctx ){
        console.log('insertRate');
        const { uid, serve_id, time, rate_pic, content, belong } = ctx.request.body;
        let res = await new Promise((resolve, reject) => {
            const sqlInsert = `insert into rate set ?`
            db.query(sqlInsert,{ uid, serve_id, time, rate_pic, content, belong }, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '插入评论失败'))
                }
                else{
                    resolve(ctx._rtn(0, '插入评论成功',{rid: rst.insertId}))
                }
            })
        })
        ctx.body = res
    }
    // async updateNotice( ctx ){
    //     console.log('updateNotice');
    //     const { nid, publisher, ncontent, time, receiver, nstatus,title } = ctx.request.body;
    //     let res = await new Promise((resolve, reject) => {
    //         const sqlUpdate = `update notice  set ? where nid = ${nid}`
    //         db.query(sqlUpdate,{ publisher, ncontent, time, receiver, nstatus,title }, function(err, rst){
    //             if(err){
    //                 resolve(ctx._rtn(1 ,err.message))
    //             }
    //             else if(rst.affectedRows !== 1){
    //                 resolve(ctx._rtn(1, '更新评论失败'))
    //             }
    //             else{
    //                 resolve(ctx._rtn(0, '更新评论成功', rst))
    //             }
    //         })
    //     })
    //     ctx.body = res
    // }
    async deleteRate( ctx ) {
        console.log('deleteNotice');
        const { rid } = ctx.request.body
        let res = await new Promise((resolve, reject) => {
            const sqlDelete = `delete from rate where rid = ${rid}`
            db.query(sqlDelete, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '删除失败'))
                }
                else{
                    resolve(ctx._rtn(0, '删除评论成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async getRate( ctx ){
        console.log('getRate');
        let { serve_id, size, page } = ctx.query
        let start = (page - 1) * size
        let end =  page * size
        let res = await new Promise((resolve, reject) => {
            const sqlSelect = `select * from rate A
            left join ( select uid,user_pic,nickname  from dev_users ) as  B
            on A.uid = B.uid
            where serve_id=${serve_id}
            limit ${start},${end}`
            db.query(sqlSelect, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length < 0){
                    resolve(ctx._rtn(1, '获取评论失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取评论成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async updateRPic ( ctx ) {
        console.log('updateRPic');
        let filePath =  []
        let { rid } = ctx.request.body;
        for(let file of ctx.request.files.file){
            console.log(file);
            let index = file.path.indexOf('\\upload')
            filePath.push(file.path.slice(index));
        }
        //图片路径入库
        let res = await new Promise((resolve, reject) => {
            const sqlUpdate = `update rate set rate_pic=? where rid=?`;
            db.query(sqlUpdate, [filePath.join(','), rid], function(err, rst){
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
}

module.exports = new Service()