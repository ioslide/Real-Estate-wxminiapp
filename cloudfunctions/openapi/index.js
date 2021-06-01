// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'wunderweather-nwepb'
})

exports.main = async (event, context) => {
  console.log(event)
  switch (event.action) {
    case 'getOpenData': {
      return getOpenData(event)
    }
    case 'getRunData': {
      return getRunData(event)
    }
    case 'getTokenize': {
      return getTokenize(event)
    }
    case 'getContext': {
      return getContext(event)
    }
    default: {
      return
    }
  }
}
async function getTokenize(event) {
  const openai = require('openai-sdk')

  console.log(openai)
  let init = openai.default.init
  let nlp = openai.default.nlp
  init({
    TOKEN: "WmlasdlPkVIUh9hvwdKaVA1CRCYSaX",
    EncodingAESKey: "NTitptUwaJbytXmzUjfOWCH1J2rN098ZWYWFdM6eASJ"
  })
  let returnMsg = await nlp.tokenize({
    uid: event.openid,
    data: {
      q: event.msg
    }
  })
  return returnMsg
}

async function getOpenData(event) {
  return cloud.getOpenData({
    list: event.openData.list,
  })
}

async function getRunData(event) {
  delete event.userInfo
  return event
}

async function getContext(event) {
  const wxContext = cloud.getWXContext()
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  }
}