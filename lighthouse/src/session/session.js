import { startFlow } from 'lighthouse'
import puppeteer from 'puppeteer'
import * as util from '../util/util.js'
import { sendMsg } from '../util/slack.js'
import { generateReportWriteMetrics } from '../util/reporting.js'
import { MainPage } from '../page/main-page.js'

let aggregatedResult = { steps: [] }
const browserOptions = util.parseJsonIntoObj(`${process.cwd()}/resources/browser-options.json`)
browserOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH
export const flowConfig = util.parseJsonIntoObj(`${process.cwd()}/resources/flow-config.json`)

export async function startBrowser(url) {
    const browser = await puppeteer.launch(browserOptions)
    const page = await browser.newPage()
    await page.goto(url)
    return page
}

export async function startLhFlowOpenMainPage() {
    let page
    let flow
    let message
    try {
        page = await startBrowser(`${process.env.BASE_URL}`)
    } catch (error) {
        message = `Failed to launch browser - ${error}`
        console.log(message)
        await sendMsg(message)
    }
    try {
        flow = await startFlow(page, flowConfig)
    } catch (error) {
        message = `Failed to start LH flow - ${error}`
        console.log(message)
        await sendMsg(message)
    }
    message = 'UI testing has began! New session started.'
    console.log(message)
    await sendMsg(message)
    return new MainPage(flow)
}



export async function endSession() {
    await generateReportWriteMetrics(aggregatedResult)
}


export async function collectResult(flow) {
    const result = await flow.createFlowResult()
    const steps = result.steps
    steps.forEach(step => {
        aggregatedResult.steps.push(step)
    });
    await flow._page.browser().close()
}