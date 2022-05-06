const db = require('../../db');
const config = require('../../config')
class Service {
    constructor(){

    }

    async addMagazine( ctx ) {
        //入参:  serve_id(必要)  goods_pic, goods_remark（可选）
        console.log('addMagazine');
        const { magazine_section, section_id } = ctx.request.body
        const sqlInsert = `insert into magazine set ?`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlInsert, {magazine_section, section_id}, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '增加杂志失败'))
                }
                else{
                    resolve(ctx._rtn(0, '增加杂志成功',{
                        mid: rst.insertId,
                    }))
                }
            })
        })
        ctx.body = res;
    }

    async deleteMagazineByMId( ctx ) {
        //入参 goods_id
        console.log('deleteMagazineByMId');
        const { mid } = ctx.query;
        const sqlInsert = `delete from magazine where mid= ${mid}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlInsert, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '删除杂志失败'))
                }
                else{
                    resolve(ctx._rtn(0, '删除杂志成功'))
                }
            })
        })
        ctx.body = res
    }

    async updateMagazine( ctx ){
        //入参: goods_id, goods_name, goods_price,（必要）  goods_pic, goods_remark（可选）
        console.log('updateMagazine');
        const { mid, magazine_name, magazine_section } = ctx.request.body
        const sqlUpdate = `update magazine set ? where mid=${mid}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlUpdate,{magazine_name, magazine_section},function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '更新杂志失败'))
                }
                else{
                    resolve(ctx._rtn(0, '更新杂志成功'))
                }
            })
        })
        ctx.body = res
    }

    async getMagazineCommon( ctx ){
        //入参： serve_id
        console.log('getMagazine');
        const { serve_id, uid } = ctx.query
        const sqlSelect = `select C.*,D.count from magazine as C left join (select mid,id,count,uid 
            from magazineorder A 
            where not exists (select * from magazineorder B where A.mid=B.mid and A.id<B.id and uid=${uid})) AS D
            on C.mid = D.mid`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlSelect,function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length === 0){
                    resolve(ctx._rtn(1, '获取杂志失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取杂志成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async getMagazineManage( ctx ){
        //入参： serve_id
        console.log('getMagazine');
        const { serve_id } = ctx.query
        const sqlSelect = `select * from magazine`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlSelect,function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length === 0){
                    resolve(ctx._rtn(1, '获取杂志失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取杂志成功', rst))
                }
            })
        })
        ctx.body = res
    }
    async uploadMagazinePicture( ctx ){
        console.log('uploadMagazinePicture');
        let filePath =  []
        let { mid } = ctx.request.body;
        for(let file of ctx.request.files.file){
            let index = file.path.indexOf('\\upload')
            console.log(index);
            filePath.push(file.path.slice(index));
        }
        //图片路径入库
        let res = await new Promise((resolve, reject) => {
            const sqlInsert = `update magazine set magazine_pic=? where mid=?`;
            db.query(sqlInsert, [filePath.join(','), mid], function(err, rst){
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
    async deleteMagazineByCate( ctx ){
        // 入参： cate名称，serve_id（必要）
        console.log('deleteMagazineByCate');
        const { magazine_section } = ctx.query;
        let res = await new Promise((resolve, reject) => {
            const sqlDelete = `delete from magazine where magazine_section=?`
            db.query(sqlDelete, [mid, magazine_section], function(err, rst){
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
    async addMCategory( ctx ){
        //入参 serve_id
        console.log('addMCategory');
        const { magazine_section } = ctx.request.body
        const section_id = parseInt(Date.now().toString().substr(0,10))
        const sqlInsert = `insert into magazine set ?`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlInsert, { magazine_section, section_id }, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '增加种类失败'))
                }
                else{
                    resolve(ctx._rtn(0, '增加种类成功',{
                        mid: rst.insertId,
                        section_id
                    }))
                }
            })
        })
        ctx.body = res;
    }
    async magazineOrder( ctx ) {
        console.log('addMagazine');
        let { mid, uid, all_count } = ctx.request.body
        let count = all_count
        const sqlInsert = `insert into magazineOrder set ?`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlInsert, {mid, uid, all_count, count}, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '预定杂志失败'))
                }
                else{
                    resolve(ctx._rtn(0, '预定杂志成功',))
                }
            })
        })
        ctx.body = res;
    }
}

module.exports = new Service()