import { startFlow, desktopConfig, generateReport } from 'lighthouse'
import puppeteer from 'puppeteer'
import * as util from '../util/util.js'
import fs from 'fs'

const browserOptionsStr = fs.readFileSync(`${process.cwd()}/resources/browser-options.json`).toString()
const browserOptions = JSON.parse(browserOptionsStr)
browserOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH

export async function startBrowser(url) {
    const browser = await puppeteer.launch(browserOptions)
    const page = await browser.newPage()
    await page.goto(url)
    return page
}
export async function startUserFlow({ url }) {
    const page = await startBrowser(url)
    const flow = await startFlow(page, {config: desktopConfig})
    return flow
}

export async function endSessionWithReport(flow) {
    await util.generatReport(flow)
    await flow._page.browser().close()
}