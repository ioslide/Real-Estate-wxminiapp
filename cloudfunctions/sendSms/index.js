const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let contentMsg =  event.type + ':' + event.userName +'-' + event.userPhone
  console.log(contentMsg)
  const result = await cloud.openapi.cloudbase.sendSms({
    env: 'lunfanglue-7g33jtt446e6cefa',
    sms_type:"Marketing",
    path:"/cms-activities/index.html?activityId=79550af260dae20b22dc896c790138ce&source=_cms_sms_",
    content:contentMsg,
    phoneNumberList: [
      "+86" + event.userPhone
    ]
  })
    return result
}