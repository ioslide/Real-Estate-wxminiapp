// // 云函数入口文件
// const cloud = require('wx-server-sdk')
// const {
//   SmsClient
// } = require('sms-node-sdk');


// const AppID = 1400541695;  // SDK AppID是1400开头

// // 短信应用SDK AppKey ，替换为你自己的 AppKey
// const AppKey = '51e8429f4af01206184b8c46110dd442';

// cloud.init({
//   env: cloud.DYNAMIC_CURRENT_ENV
// })
// // 云函数入口函数
// exports.main = async (event, context) => {
//   // 需要发送短信的手机号码
// const phoneNumber = event.phone;
//   let code = event.code;
//   let smsClient = new SmsClient({ AppID:1400541695, AppKey:'51e8429f4af01206184b8c46110dd442' });
//   const result = await smsClient.init({
//     action: 'SmsSingleSendTemplate',
//     data: {
//       nationCode: '86',
//       phoneNumber,
//       templId: 1017720,
//       params: [code],
//       sign: '论方略房产服务' // 签名参数未提供或者为空时，会使用默认签名发送短信
//     }
//   })
//   return {event,result}
// }

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
exports.main = async (event, context) => {
  console.log(event)
  try {
    let phoneNum = "+86" + event.phone
    let contentMsg = "验证码:" + event.code

    // const getUrllink = await cloud.openapi.urllink.generate({
    //   "path": '/pages/index/index',
    //   "query": '',
    //   "isExpire": false,
    //   "expireTime":0,
    //   "expireInterval": 1,
    //   "cloudBase": {
    //     "env": 'lunfanglue-7g33jtt446e6cefa',
    //     "domain": 'lunfanglue-7g33jtt446e6cefa-1306211988.tcloudbaseapp.com',
    //     "path": '/cms-activities/index.html',
    //     "query": 'activityId=28ee4e3e60cca97a236146337f5416e9&source=_cms_sms_'
    //   }
    // })
    const result = await cloud.openapi.cloudbase.sendSms({
      env: 'lunfanglue-7g33jtt446e6cefa',
      sms_type:"Marketing",
      path:"/cms-activities/index.html?activityId=79550af260dae20b22dc896c790138ce&source=_cms_sms_",
      content:contentMsg,
      phoneNumberList: [
        phoneNum
      ]
    })
    return result
  } catch (err) {
    return err
  }
}