// 导入模块
const mysql = require('mysql');
// 创建数据库连接对象
let db;
try{
    db = mysql.createPool({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'community'
    })
}catch(err){
    console.log("连接数据库失败");
}


//向外共享 db 数据库连接对象
module.exports = db;