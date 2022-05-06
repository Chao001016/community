function genValidator(validateFunc){
    return async function validator(ctx, next){
        const error = validateFunc(ctx.request.body)
        if (error) {
            console.log('数据校验失败')
            //校验失败
            ctx.body = 'error'
            return
        }
        await next()
    }
}
module.exports = {
    genValidator
}