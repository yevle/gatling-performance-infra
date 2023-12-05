import { WebClient } from "@slack/web-api";
import fs from 'fs'

export async function sendMsg(message) {
    const slack = new WebClient(process.env.SLACK_TOKEN)
    // await joinChannel('C0691PL21CH')
    await slack.chat.postMessage({ text: message, channel: `${process.env.APP_CHANNEL_ID}` })
    await slack.chat.postMessage({ text: message, channel: `${process.env.ADDITIONAL_CHANNEL_ID}` })
}

async function joinChannel(channelId) {
    const slack = new WebClient(process.env.SLACK_TOKEN)
    await slack.conversations.join({ channel: channelId })
}

export async function sendHtmlReport(report) {
    const slack = new WebClient(process.env.SLACK_TOKEN)
    const fileBuffer = fs.readFileSync(report.path)

    await slack.filesUploadV2({
        channel_id: `${process.env.APP_CHANNEL_ID}`,
        file: fileBuffer,
        initial_comment: report.comment,
        filename: report.title
    })
}

