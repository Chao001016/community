const validate = require('./validate');
// 校验规则
const SCHEMA = {
    type: 'object',
    properties: {
        account: {
            type: 'string',
            pattern: '^[0-9]{1,12}$', //1到12位的数字
            // maxLength: 255,
            // minLength: 1
        },
        password: {
            type: 'string',
            pattern: '^[0-9]{1,12}$', //1到12位的数字
            // maxLength: 255,
            // minLength: 1
        },
    }
}

/**
 * 校验用户数据格式
 * @param {Object} data 用户数据
 */
function accountValidate(data = {}) {
    return validate(SCHEMA, data)
}

module.exports = {
    accountValidate
}
