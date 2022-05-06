const bcrypt = require('bcryptjs');
const db = require('../../db/index');
const jwt = require('jsonwebtoken');
const config = require('../../config')
const per = require('../../permission-role')
// db.query(`update dev_users set permission = '${JSON.stringify(per.common)}' where user_type=0`)
// db.query(`update dev_users set permission = '${JSON.stringify(per.seller)}' where user_type=1`)
// db.query(`update dev_users set permission = '${JSON.stringify(per.manager)}' where user_type=2`)
// db.query(`update dev_users set permission = '${JSON.stringify(per.superManager)}' where user_type=3`)
class Service{
    constructor(){

    }
    async registe(ctx){
        console.log('registe');
        //接收表单数据
        const userinfo = ctx.request.body;
        //判断数据是否合法
        if(!userinfo.account || !userinfo.password){
            ctx.body = { status: 1, message: '用户名或密码不能为空！' };
            return
        }
        //检验用户名是否被占用
        const sqlSelect = 'select * from dev_users where account=?';
        let res = await new Promise((resolve, reject) => {
            db.query(sqlSelect, [userinfo.account], function(err,results) {
                if(err){
                    reject({ status: 1, message: err.message })
                }
                if(results.length > 0){
                    resolve({ status: 1, message: '用户名被占用，请更换其他用户名' })
                }
                resolve("sucess")
            })
        }) 
        if(res !== "sucess"){
            ctx.body = res;
            return
        }
        //对密码进行加密处理,将用户信息插入数据库
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        const sqlInsert = 'insert into dev_users set ?';
        let permission
        if(userinfo.userType == 0){
            permission = JSON.stringify(per.common)
        } else if(userinfo.userType == 1) {
            permission = JSON.stringify(per.seller)
        } else if(userinfo.userType == 2) {
            permission = JSON.stringify(per.manager)
        }
        res = await new Promise((resolve,reject)=> {
            db.query(sqlInsert, { account: userinfo.account, password: userinfo.password, user_type: userinfo.userType, permission}, function(err, results){
                if(err){
                    resolve({ status: 1, message: err.message });
                }
                else if(results.affectedRows !== 1){
                    resolve({ status:1, message: '注册用户失败，请稍后再试！' });
                }
                else{
                    resolve({ status: 0, message: '注册成功' });
                }
                
            })
        })
        ctx.body = res
    }
    async login(ctx){
        const userinfo = ctx.request.body;
        if(!userinfo.account || !userinfo.password){
            ctx.body = {
                status: 0,
                message: '请输入账号密码'
            }
            return
        }
        const sql = `select * from dev_users where account=?`
        let res = await new Promise((resolve, reject) => {
            db.query(sql, userinfo.account, function(err, results){
                if(err){
                    resolve({status: 1, message: err.message});
                }
                else if(results.length !== 1){
                    resolve({status:1, message:'账号或密码错误'})
                }
                else{

                    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
                    if(!compareResult) resolve({status:1, message:'账号或密码错误'});
                    const user = { ...results[0], password:'', user_pic:'' }
                    const config = require('../../config');
                    const tokenJWT = jwt.sign(user, config.jwtSecretKey, {
                        expiresIn: '10h'
                    })
                    resolve({status:0, message: user, token:'Bearer ' + tokenJWT})
                }
                
            })
        })
        ctx.body = res;
    }
    async getUserInfo(ctx){
        const { uid } = ctx.query
        const sqlSelect = `select * from dev_users where uid=${uid}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlSelect, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.length !== 1){
                    resolve(ctx._rtn(1, '获取用户信息失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取用户信息成功', rst[0]
                    ))
                }
            })
        })
        ctx.body = res
    }
    async updateUserInfo( ctx ) {
        console.log('updateUserInfo')
        const { uid, nickname, sex, email, phone, address, app_identity } = ctx.request.body
        let params = {}
        uid && (params.uid = uid)
        nickname && (params.nickname = nickname)
        sex && (params.sex = sex)
        email && (params.email = email)
        phone && (params.phone = phone)
        address && (params.address = address)
        app_identity && (params.app_identity = app_identity)
        let filePath =  []
        if(ctx.request.files && ctx.request.files.file) {
            for(let file of ctx.request.files.file){
                let index = file.path.indexOf('\\upload')
                filePath.push(file.path.slice(index));
            }
        }
        if(filePath.length>0){
            params.user_pic = filePath.join(',')
        }
        const sqlUpdate = `update dev_users set ? where uid=${uid}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlUpdate, params, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '更新用户信息失败',))
                }
                else{
                    resolve(ctx._rtn(0, '更新用户信息成功',))
                }
            })
        })
        ctx.body = res
    }
    async getAllUser(ctx){
        const sqlSelect = `select * from dev_users`
        const { page, size } = ctx.query
        let start = (page - 1) * size
        let end =  page * size
        let res = await new Promise((resolve, reject) => {
            db.query(sqlSelect, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.length <= 0){
                    resolve(ctx._rtn(1, '获取用户信息失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取用户信息成功', {
                        totalPage: Math.ceil(rst.length / size),
                        totalSize: rst.length,
                        data: rst.slice(start,end)
                    }))
                }
            })
        })
        ctx.body = res
    }
    async _updateUserInfo( ctx ) {
        console.log('_updateUserInfo')
        db.query(`update dev_users set permission = '${JSON.stringify(per.common)}' where user_type=0`)
        db.query(`update dev_users set permission = '${JSON.stringify(per.seller)}' where user_type=1`)
        db.query(`update dev_users set permission = '${JSON.stringify(per.manager)}' where user_type=2`)
        db.query(`update dev_users set permission = '${JSON.stringify(per.superManager)}' where user_type=3`)
    }
    async updatePermission( ctx ) {
        console.log('updatePermission')
        let { permission, uid } = ctx.request.body
        const sqlUpdate = `update dev_users set permission=${permission} where uid=${uid}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlUpdate, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.affectedRows !== 1){
                    resolve(ctx._rtn(1, '更新用户权限失败',))
                }
                else{
                    resolve(ctx._rtn(0, '更新用户权限成功',))
                }
            })
        })
        ctx.body = res
    }
    async getPermission ( ctx ) {
        const { uid } = ctx.query
        const sqlSelect = `select permission from dev_users where uid=${uid}`
        let res = await new Promise((resolve, reject) => {
            db.query(sqlSelect, function(err, rst){
                if(err){
                    resolve(ctx._rtn(1, err.message))
                }
                else if(rst.length !== 1){
                    resolve(ctx._rtn(1, '获取用户权限失败'))
                }
                else{
                    resolve(ctx._rtn(0, '获取用户权限成功', rst[0]
                    ))
                }
            })
        })
        ctx.body = res
    }
}
module.exports = new Service()