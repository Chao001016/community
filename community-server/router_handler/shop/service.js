const db = require('../../db/index');
const config = require('../../config');
class Service{
    constructor(){

    }
    //申请入驻 提交的表单信息
    async applyIn( ctx ) {
        let { shop_name, shop_addr, serve_type, serve_id, status ,phone} = ctx.request.body;
        //数据入库
        let res = await new Promise((resolve, reject) => {
            const sqlInsert = `update service set ? where serve_id=${serve_id}`
            db.query(sqlInsert, {shop_name, uid:ctx._userInfo.uid, shop_addr, serve_type, status, phone}, function(err,rst){
                if(err)resolve(err)
                else if(rst.affectedRows !== 1) {
                    resolve({
                        status: 1,
                        message: '上传失败'
                    })
                }
                else{
                    resolve({
                        status: 0,
                        message: '上传成功',
                    })
                }
            })
        })
        ctx.body = res
    }

    //申请入驻 获取货架信息
    async getShopMenu( ctx ) {
        //入参 uid
        console.log('getShopMenu');
        const { size = 10, page = 1, status } = ctx.query
        let start = (page - 1) * size
        let end =  page * size
        let sqlSelect = `select * from service where uid=?`;
        if (status) {
            sqlSelect = `select * from service where uid=? AND status=${status}`
            if(status == 'null')
            sqlSelect = `select * from service where uid=? AND status is null`
        }
        let res = await new Promise((resolve, reject) => {
             db.query(sqlSelect, [ctx._userInfo.uid], function(err,rst){
                 if(err){
                     resolve(ctx._rtn(1, err.message));
                 }
                 else if(rst.length < 0){
                     resolve(ctx._rtn(1, '还未拥有货架'))
                 }
                 else{
                     resolve(ctx._rtn(0, '获取商店信息成功！', {
                        totalPage: Math.ceil(rst.length / size),
                        totalSize: rst.length,
                        data: rst.slice(start,end)
                    }))
                 }
             })
        })
        ctx.body = res 
    }

    //服务入驻 新建服务
    async createShelter( ctx ) {
        const sqlInsert = `insert into service set ?`;
        let res = await new Promise((resolve, reject) => {
             db.query(sqlInsert, { uid: ctx._userInfo.uid }, function(err, rst){
                 if(err){
                     resolve(ctx._rtn(1, err.message));
                 }
                 else if(rst.affectedRows !== 1){
                     resolve(ctx._rtn(1, '用户信息出错'))
                 }
                 else{
                     resolve(ctx._rtn(0, '新建服务成功！', {
                         serve_id: rst.insertId
                     }))
                 }
             })
        }).catch(err=>{
            console.log(err);
         })
         ctx.body = res
    }

    //申请入驻 提交认证图片
    async certificate( ctx ) {
        console.log('certificate');
        let filePath =  []
        let { serve_id } = ctx.request.body;
        console.log(ctx.request.files);
        for(let file of ctx.request.files.file){
            let index = file.path.indexOf('\\upload')
            filePath.push(file.path.slice(index));
        }
        //图片路径入库
        let res = await new Promise((resolve, reject) => {
            
            const sqlInsert = `update service set license=? where serve_id=?`;
            db.query(sqlInsert, [filePath.join(','), serve_id], function(err, rst){
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

    //申请入驻 获取待审核商店
    async getAuditShop( ctx ) {
        const sqlSelect = `select * from service where status=0`
        let res = await new Promise((resolve, reject)=>{
            db.query(sqlSelect, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length < 0){
                    resolve(ctx._rtn(1, '没有待审核的服务'))
                }
                else{
                    resolve(ctx._rtn(0, '获取待审核货架成功', rst))
                }
            })
        })
        ctx.body = res
    }

    //申请入住 通过id获取服务
    async getServiceById( ctx ){
        console.log('getServiceById');
        const sqlSelect = `select A.*,B.user_type from service as A left join dev_users as B on A.uid=B.uid  where serve_id=?`;
        let res = await new Promise((resolve, reject)=>{
            db.query(sqlSelect, [ ctx.query.id ], function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length < 0){
                    resolve(ctx._rtn(1, '未找到该服务！'))
                }
                else{
                    resolve(ctx._rtn(0, '获取服务成功', rst[0]))
                }
            })
        })
        ctx.body = res
    }
    //申请入驻 修改service id
    async updateServStatus( ctx ){
        //入参 serve_id,status
        let { status, serve_id } = ctx.request.body
        const sqlUpdate = `update service set status=${status} where serve_id=${serve_id}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlUpdate, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '修改状态失败'))
                }
                else{
                    resolve(ctx._rtn(0, '修改状态成功'))
                }
            })
        })
        ctx.body = res
    }
    async getServeByStatus( ctx ){
        console.log('getServeByStatus');
        const { size, page, status, sort, type } = ctx.query
        let start = (page - 1) * size
        let end =  page * size
        let sqlSelect = `select A.*, totalStar, orderNumber from service A
        left join ( select serve_id, sum(star) as totalStar,count(*) as orderNumber  from goodsorder group by serve_id ) as B
        on A.serve_id = B.serve_id where status=1`;
        if(sort!=='all' && sort){
            sqlSelect = `select A.*, totalStar, orderNumber from service A
            left join ( select serve_id, sum(star) as totalStar,count(*) as orderNumber  from goodsorder group by serve_id ) as B
            on A.serve_id = B.serve_id order by ${sort} DESC`
        }
        else if(type > 0){
            sqlSelect = `select A.*, totalStar, orderNumber from service as A 
            left join ( select serve_id, sum(star) as totalStar,count(*) as orderNumber  from goodsorder group by serve_id ) as B
            on A.serve_id = B.serve_id where serve_type =${type} and status = ${status}`
        }
        if(sort!=='all' && sort && type > 0){
            sqlSelect = `select * from service A
            left join ( select serve_id, sum(star) as totalStar,count(*) as orderNumber  from goodsorder group by serve_id ) as B
            on A.serve_id = B.serve_id  where serve_type = ${type} and status = ${status}  order by ${sort} DESC`
        }
        let res = await new Promise((resolve, reject)=>{
            db.query(sqlSelect, [ status ], function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.length < 0){
                    resolve(ctx._rtn(1, '未找到该服务！'))
                }
                else{
                    resolve(ctx._rtn(0, '获取服务成功', {
                        totalPage: Math.ceil(rst.length / size),
                        totalSize: rst.length,
                        data: rst.slice(start,end)
                    }))
                }
            })
        })
        ctx.body = res     
    }
    //修改商店信息
    async updateShopInfo( ctx ){
        //入参 serve_id,status
        let { shop_name, serve_type, shop_addr, serve_id, contact, phone, content, payway } = ctx.request.body
        let params = {}
        shop_name&&(params.shop_name=shop_name)
        serve_type&&(params.serve_type=serve_type)
        shop_addr&&(params.shop_addr=shop_addr)
        serve_id&&(params.serve_id=serve_id)
        contact&&(params.contact=contact)
        phone&&(params.phone=phone)
        content&&(params.content=content)
        payway&&(params.payway=payway)
        const sqlUpdate = `update service set ? where serve_id=${serve_id}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlUpdate, params,function(err, rst){
                if(err){
                    resolve(ctx._rtn(1 ,err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '修改状态失败'))
                }
                else{
                    resolve(ctx._rtn(0, '修改状态成功'))
                }
            })
        })
        ctx.body = res
    }
    //修改商店图片
    async updateShopPic( ctx ) {
        console.log('updateShopPic');
        let filePath =  []
        let { serve_id } = ctx.request.body;
        for(let file of ctx.request.files.file){
            let index = file.path.indexOf('\\upload')
            filePath.push(file.path.slice(index));
        }
        console.log(serve_id);
        //图片路径入库
        let res = await new Promise((resolve, reject) => {
            const sqlInsert = `update service set shop_pic=? where serve_id=?`;
            db.query(sqlInsert, [filePath.join(','), serve_id], function(err, rst){
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