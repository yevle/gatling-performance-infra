import fs from 'fs'
import { WebClient } from "@slack/web-api";
import { decrypt } from './util.js';

const token = decrypt(`${process.env.CRYPTO_KEY}`, `${process.env.SLACK_TOKEN}`)

export async function sendMsg(message) {
    const slack = new WebClient(token)
    //  await joinChannel(`${process.env.ADDITIONAL_CHANNEL_ID}`)
    slack.chat.postMessage({ text: message, channel: `${process.env.APP_CHANNEL_ID}` })
    slack.chat.postMessage({ text: message, channel: `${process.env.ADDITIONAL_CHANNEL_ID}` })
}

async function joinChannel(channelId) {
    const slack = new WebClient(token)
    await slack.conversations.join({ channel: channelId })
}

export async function sendReportUrl(reportURL) {
    const slack = new WebClient(token)
    await slack.chat.postMessage({ text: reportURL, channel: `${process.env.APP_CHANNEL_ID}` })
}

export async function sendHtmlReport(report) {
    const slack = new WebClient(token)
    const fileBuffer = fs.readFileSync(report.path)

    await slack.filesUploadV2({
        channel_id: `${process.env.APP_CHANNEL_ID}`,
        file: fileBuffer,
        initial_comment: report.comment,
        filename: report.title
    })
}



