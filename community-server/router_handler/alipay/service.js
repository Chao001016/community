const db = require('../../db');
const config = require('../../config')

// 引入alipay sdk 模块
const AlipaySdk = require('alipay-sdk').default
// 引入alipay form 模块
const AlipayFormData = require('alipay-sdk/lib/form').default
// const AlipayFundTransUniTransferRequest = require()
//初始化alipay 配置
const alipaySdk = new AlipaySdk({
  appId: '2021000119651623', // 沙箱环境上的appid
  // 应用私钥   
  privateKey: 'MIIEowIBAAKCAQEAsusBcTZ1W/wlh8QJ66MomRL7Ozeco4oHWYA1z6PmH1V62XBAAxFYjQlmH5g+1t3DUG2AMXtKV8G//M5N4a9/z2qE4qKL+6avlQBuHRV/w7IhQMo0T2bs6eTqts2B7v2x++qHFXnaAlqTN5Z0ggOj9Wl0y/ZfDHwNLrKbkCADuMU1B0b7ytW7oDJSF4hCa4uzP6nO6SI8tnZReibgW0I6HUqhsARNneWei0vf4yM/JKWf3qPcLob10x4d+6HUvkByYxYyhbxRBLjidtX9uxKPhdpGNLZ3EngbDpHB4k8GcbRo28yBE/aFYsBeuW5rZ8lDvMHJDKBB2Ps08O2DXFxDbQIDAQABAoIBAQCMA9r6FQsctCNOrvyweduwhykye1/Kn58GzI3P88yH4uYjuXNusylgHeXcfdFXZu6NR1QV5Q0VxhsPpQdPwX68+/gIP/paMmSfr1l8yzFUHVdmk5cCOGLY23tPGV5AgCrEIRIbnWMdinJBAy4j/ONXj3KGl0RkycOrMr0IufUPp33TGdUgslGLGG+MgJSfODezyWSD24YhMDoz16ZMSS+VDwb8C0RKVe9XNhOc6UFDxqHUnRXAlpNZn0HLCTLq8Um5buRhemvYz8IEsGOOl7ShpgdAnA7MYer+f4ZZJkxiPGklK2EZawJmv3vAfgGhVS0i7arJQj1CslhZnLtXk1RBAoGBANZZLtqK9zc/XPCctAnz3pJbMxAGkOpX69LsH/13YuoViZABmnhgYy/4gnQKr5kkfLKsc613rLiZ7u9NndUw6yERMCYcpTqM1adl65gUIITEvQlOAs1cmJfl4dYCTkg0b+/gHVmcx3BI5kT4Px0q/eiqmWBRrRD8Ot7vGhRrCbERAoGBANWvVDER6PpmkFrXZWNmiUUSKSVf54zgVrIG6ECtE/gDfQZD7ZeoKsmXzmI7Xoxk2/lp/7FrNuHNf87qf3VtE7nMfLu9oKW71EMTQnTKn6A9E0U0MY6VluD+DpntBwy7t/gsktDjgRqc4odeVX6/k/4SzDjggEN4lBiNQOrlP+ydAoGAEhLXBoptKfVnysoLzEMJ42FZPuKu2XOsaM6MK/0jFAXY4ZGhCsFl26eiqFI2WD1hXld4MYpDwBUKtpbe1hkX2mPuoWgM7pDtev33DY206D0Gi4BOcC58l2JE1py/KQty3NES6Hl1v5wF/o7IE5eKbVHlON/qLeJ2vFGA63PTD2ECgYBhOOZ7dQSleSjQzBPLSAnIrVyfLqVxiVioo0/krVraiuvFf/6H8/GTy0gRlaWNBw62yi2WEYvk7NTr1fGsAbbp4EoYOUzwWydWZVrlPJOoGmG8KOUrVJBTSgRmsFt2xaoMdmtOM1S4QQ0oPhl0E8JH5VGZxztUd3YaPZp9xVRyWQKBgGPD4fEUQt098QZOcjyIUBJ3BhIqhWyKIzsbdnUiRExYvxkycUp0Va/mLybTHt1k4ehCzT89Bj2qJO5vb/DlzhBCDZlNrfsdsLLtWU1d3UQ09xQzP0DxbLNGsvH5JXbV+9UUS2vjgSsUJ0pL1HjnxGsecSCBpfzpInU7+UvRr2gC',
  // 支付宝公钥   
  alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqEhnytsZrmwyclNuDAuAH7eASNKszfiNHcwmFl2b9fDCYeTpzWg+vtCkJdOpQzgTPvvyXjF8IDkGf4AdJIAPnSA+rTe//LZ27ZAUYwusN6bj0BB2jJsa2AqTLypdS3OmxDwDp+PqkrM+Svuqa0YOo4cSKy1p7ayZNGzQIP3/ej1CXnSg98mk1Yi+stXRGSceh55jBYxrbEkeAHBzeB1bFtPwq1npAJgF9phU1iz99oJe/3wDae+tCKaCe6uSSBOho/YaNLKT3df+dtFPpkGjuFTrysrx3+iRvCA1JRvHjQOUAchXXuz5/KerShrlmVeVV+uHJP9KErfe/JPH0TbE2wIDAQAB',
  // 沙箱环境的网关   
  gateway: 'https://openapi.alipaydev.com/gateway.do',
  // 沙箱环境   
  sandbox: true,
})
async function a(){
    const formData = new AlipayFormData()
    formData.setMethod('get');
    // 调用alipay的转账接口
    formData.addField('bizContent', {
        out_biz_no: Date.now(),
        productCode: 'TRANS_ACCOUNT_NO_PWD',
        trans_amount: 30,
        biz_scene: 'DIRECT_TRANSFER',
        payee_info: {
            identity: '2088622958242554',
            identity_type: 'ALIPAY_USER_ID',
            // name: 'xwuooq4228'
        },
    });
    const result = await alipaySdk.exec(
        'alipay.fund.trans.uni.transfer',
        {},
        { formData: formData },
    );
    ctx.body = ctx._rtn(0,'业务运行成功', result)
}
a()
class Service {
    constructor(){

    }
    // 调用alipay的支付接口
    async pay( ctx ) {
        let { goodslist, totalAmount } = ctx.request.body
        const outTradeNo = Date.now()
        const formData = new AlipayFormData()
        formData.setMethod('get');
        formData.addField('bizContent', {
            outTradeNo: Date.now(),
            productCode: 'FAST_INSTANT_TRADE_PAY',
            totalAmount: totalAmount,
            subject: '商品',
            body: JSON.stringify(goodslist),
        });
        const result = await alipaySdk.exec(
            'alipay.trade.wap.pay',
            {},
            { formData: formData },
        );
        ctx.body = ctx._rtn(0,'业务运行成功', Object.assign({},{url: result, outTradeNo}))
    }

    // 调用alipay订单查询接口 
    async queryOrder( ctx ){
        let { outTradeNo } = ctx.request.body
        const formData = new AlipayFormData()
        formData.setMethod('get');
        formData.addField('bizContent', {
            outTradeNo: outTradeNo,
        });
        // 调用alipay的订单查询接口
        const result = await alipaySdk.exec(
            'alipay.trade.query',
            {},
            { formData: formData },
        );
        ctx.body = ctx._rtn(0,'业务运行成功', Object.assign({},{ url: result }))
    }

    // 转账
    async transfer( ctx ){
        const {identity, amount}
        const formData = new AlipayFormData()
        formData.setMethod('get');
        // 调用alipay的转账接口
        formData.addField('bizContent', {
            out_biz_no: Date.now(),
            productCode: 'TRANS_ACCOUNT_NO_PWD',
            trans_amount: amount,
            biz_scene: 'DIRECT_TRANSFER',
            payee_info: {
                identity: String(identity),
                identity_type: 'ALIPAY_USER_ID',
            },
        });
        const result = await alipaySdk.exec(
            'alipay.fund.trans.uni.transfer',
            {},
            { formData: formData },
        );
        ctx.body = ctx._rtn(0,'业务运行成功', result)
    }
}

module.exports = new Service()