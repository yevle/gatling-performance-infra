import { startFlow, desktopConfig } from 'lighthouse'
import puppeteer from 'puppeteer'
import * as util from '../util/util.js'
import { sendMsg } from '../util/slack.js'
import { generateReportWriteMetrics } from '../util/reporting.js'
import fs from 'fs'

const browserOptions = util.parseJsonIntoObj(`${process.cwd()}/resources/browser-options.json`)
browserOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH
export const flowConfig = util.parseJsonIntoObj(`${process.cwd()}/resources/flow-config.json`)

export async function startBrowser(url) {
    const browser = await puppeteer.launch(browserOptions)
    const page = await browser.newPage()
    await page.goto(url)
    return page
}

export async function startUserFlow(url) {
    try {
        const page = await startBrowser(url)
        const flow = await startFlow(page, flowConfig)
        await sendMsg('UI testing began!')
        return flow
    } catch (error) {
        await sendMsg('Something went wrong, failed to start Ui testing!')
    }
}

export async function endSessionWithReport(flow) {
    await generateReportWriteMetrics(flow)
    await flow._page.browser().close()
}