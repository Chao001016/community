const mysql = require('mysql')
// 创建连接
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'null',
    database:'mmall'
})

export default connection
// 连接数据库
// connection.connect()
// var sql = 'SELECT * from mmall_cart'
// connection.query(sql, function (error, results) {
//     if (error)
//         throw error
//     // 遍历输出条目对象
//     for(var i in results){
//         console.log(results[i])
//     }
// })


// 关闭连接
// connection.end()