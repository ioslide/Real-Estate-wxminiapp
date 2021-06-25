const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
exports.main = async (event, context) => {
  console.log(event)
  try {
    const result = await cloud.openapi.cloudbase.sendSms({
      env: 'lunfanglue-7g33jtt446e6cefa',
      content: '您的验证码为'+ event.code,
      phoneNumberList: [
        "+86" + event.phone
      ]
    })
    return result
  } catch (err) {
    return err
  }
}