const db = require('../../db');
const config = require('../../config')
class Service {
    constructor(){

    }
    // 新增服务项目
    async addGoods( ctx ) {
        //入参:  serve_id(必要)  goods_pic, goods_remark（可选）
        console.log('addGoods');
        const { serve_id, goods_section, section_id } = ctx.request.body
        const sqlInsert = `insert into goods set ?`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlInsert, {serve_id, goods_section, section_id}, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '增加商品失败'))
                }
                else{
                    resolve(ctx._rtn(0, '增加商品成功',{
                        goods_id: rst.insertId,
                    }))
                }
            })
        })
        ctx.body = res;
    }

    async deleteGoodsByGoodsId( ctx ) {
        //入参 goods_id
        console.log('deleteGoodsByGoodsId');
        const { goods_id } = ctx.query;
        const sqlInsert = `delete from goods where goods_id= ${goods_id}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlInsert, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '删除商品失败'))
                }
                else{
                    resolve(ctx._rtn(0, '删除商品成功'))
                }
            })
        })
        ctx.body = res
    }

    async updateGoods( ctx ){
        //入参: goods_id, goods_name, goods_price,（必要）  goods_pic, goods_remark（可选）
        console.log('updateGoods');
        const { goods_id, goods_name, goods_price, goods_section, goods_remark } = ctx.request.body
        const sqlUpdate = `update goods set ? where goods_id=${goods_id}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlUpdate,{goods_name, goods_price, goods_section, goods_remark},function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '更新商品失败'))
                }
                else{
                    resolve(ctx._rtn(0, '更新商品成功'))
                }
            })
        })
        ctx.body = res
    }

    async getGoodsByServeId( ctx ){
        //入参： serve_id
        console.log('getGoodsByServeId');
        const { serve_id } = ctx.query
        const sqlSelect = `select * from goods where serve_id=${serve_id}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlSelect,function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length < 0){
                    resolve(ctx._rtn(1, '获取商品失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取商品成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async getNotNullGoodsByServeId( ctx ){
        //入参： serve_id
        console.log('getGoodsByServeId');
        const { serve_id } = ctx.query
        const sqlSelect = `select * from goods where serve_id=${serve_id} AND goods_name is not null`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlSelect,function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length < 0){
                    resolve(ctx._rtn(1, '获取商品失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取商品成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async uploadGoodsPicture( ctx ){
        console.log('uploadGoodsPicture');
        let filePath =  []
        let { goods_id } = ctx.request.body;
        for(let file of ctx.request.files.file){
            let index = file.path.indexOf('\\upload')
            filePath.push(file.path.slice(index));
        }
        //图片路径入库
        let res = await new Promise((resolve, reject) => {
            const sqlInsert = `update goods set goods_pic=? where goods_id=?`;
            db.query(sqlInsert, [filePath.join(','), goods_id], function(err, rst){
                if(err){
                    resolve(ctx._rtn(1,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '上传图片失败！'))
                }
                else{
                    resolve(ctx._rtn(0, '上传图片成功！', filePath))
                }
            })
        })
        ctx.body = res
    }
    async deleteGoodsByCate( ctx ){
        // 入参： cate名称，serve_id（必要）
        console.log('deleteGoodsByCate');
        const { goods_section, serve_id} = ctx.query;
        let res = await new Promise((resolve, reject) => {
            const sqlDelete = `delete from goods where serve_id=? AND goods_section=?`
            db.query(sqlDelete, [serve_id, goods_section], function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.affectedRows === 0){
                    resolve(ctx._rtn(1, '删除分类失败！'))
                }
                else{
                    resolve(ctx._rtn(0, '删除分类成功！'))
                }
            })
        })
        ctx.body = res
    }
    async addCategory( ctx ){
        //入参 serve_id
        console.log('addCategory');
        const { serve_id, goods_section } = ctx.request.body
        const section_id = parseInt(Date.now().toString().substr(0,10))
        const sqlInsert = `insert into goods set ?`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlInsert, { serve_id, goods_section, section_id }, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '增加种类失败'))
                }
                else{
                    resolve(ctx._rtn(0, '增加种类成功',{
                        goods_id: rst.insertId,
                        section_id
                    }))
                }
            })
        })
        ctx.body = res;
    }
}

module.exports = new Service()