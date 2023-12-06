import { WebClient } from "@slack/web-api";
import fs from 'fs'
import * as Encryptor from 'encryptor-node'

// process.env.SLACK_TOKEN=Encryptor.decrypt(`${process.env.KEY}`,`${process.env.ENCRYPTED_SLACK_TOKEN}`)
// console.log(Encryptor.encrypt('key',`xoxb-6294555498450-6294996686306-RyPTMt5X3HyC9Yd8q2iVwdoQ`))
// console.log(`${process.env.KEY}`)
// console.log(Encryptor.decrypt(`key`,'0d10524e5b0cbeb14a8f146facacb0fbbb30fd059c9089e7e109f77d1ba7f197fbbc8b871d5f919ca03419251fb9a32faafaa736d599d6f66c332788e1876aafab56ce905e8b53efdcc416a33feaf53e293a2e5002652cb84edd79fa8cc35b3c90022c9e819c10cc6a21d0be0c86dcef715c81ddfbd4574b652be9c6e2f14a5a2d83f87ae730186980144b03db55fe989b884c1e9753566d9b906f7199a514e6256c8abead7fe901cd9a9f044b76c9e4c490472663245b515ae7f743ddf1baf14db67262cc23228412a6289bfa6b88f98f63e228638adb4624e787ca63823f36b04fb461487789ec9af6d134a66a17be2b7790c1387878f4310ee8ea999d040a4505aaeeb38162077a43a22c8845b9eee2bbb6484b8cfdc3db1a30af170a426f0804da1cf9b8647c932360e419450f4c61cac38a5b1637b65395c88546c86d3d73a1e4847f394641a4380fc65c4e3666dd7cca6c27a53bbaccdee08c87bd8e6b0105fd7d86c9ac696ac9960e39ea6866c76ea4c889d61707a42de48a7254f89c5930affed52123ed8e7c4cc92b5fd83d8e23a0709d46e3f3dc213304079f16f47df6083df3f74f1552253d5a7d64da353a1c29c3e9bef62a67dadbf840f7f9af58e948cd4104d566d7c2741f7b9852ab891da9eea68e916bb127c1ec156af753ccb6c085c0930f04e185ebeef14ff0d26c517c1ab320b54c1d48df0820d655e29581b13ecf9481399c921d93c4fbb6b72df8c8c873603f08bf99f3bb7749c1b299ffbd8ef205797dda71a8e313d3755dec058f5b9d39a483d2dfb5e58810aeeaafbf02dff7e50dd35cb4584e9bff4aac'))

export  function sendMsg(message) {
    const slack = new WebClient(decryptToken())
    // await joinChannel(`${process.env.ADDITIONAL_CHANNEL_ID}`)
     slack.chat.postMessage({ text: message, channel: `${process.env.APP_CHANNEL_ID}` })
     slack.chat.postMessage({ text: message, channel: `${process.env.ADDITIONAL_CHANNEL_ID}` })
    }

async function joinChannel(channelId) {
    const slack = new WebClient(decryptToken())
    await slack.conversations.join({ channel: channelId })
}

export async function sendReportUrl(reportURL){
    const slack = new WebClient(decryptToken())
    await slack.chat.postMessage({ text: reportURL, channel: `${process.env.APP_CHANNEL_ID}` })
}

export async function sendHtmlReport(report) {
    const slack = new WebClient(decryptToken())
    const fileBuffer = fs.readFileSync(report.path)

    await slack.filesUploadV2({
        channel_id: `${process.env.APP_CHANNEL_ID}`,
        file: fileBuffer,
        initial_comment: report.comment,
        filename: report.title
    })
}

  function decryptToken(){
   return Encryptor.decrypt('key', `${process.env.ENCRYPTED_SLACK_TOKEN}`)
}

