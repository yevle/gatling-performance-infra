import { startFlow } from 'lighthouse'
import puppeteer from 'puppeteer'
import * as util from '../util/util.js'
import { sendMsg } from '../util/slack.js'
import { generateTestReport, writeAggregatedMetrics } from '../util/reporting.js'
import { MainPage } from '../page/main-page.js'
import { flow } from '../../test.js'

let aggregatedTestResult = { steps: [] }
let aggregatedSessionResult = { steps: [] }
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
        console.log('Session started.')
    } catch (error) {
        message = `Failed to start LH flow - ${error}`
        console.log(message)
        await sendMsg(message)
    }
    return new MainPage(flow)
}



export async function endSession() {
    const result = await flow.createFlowResult()
    const steps = result.steps
    steps.forEach(step => {
        aggregatedSessionResult.steps.push(step)
        aggregatedTestResult.steps.push(step)
    });
    await flow._page.browser().close()
    console.log('Session closed.')
    await writeAggregatedMetrics(aggregatedSessionResult)
    aggregatedSessionResult = { steps: [] }
}

export async function endTest(){
    await generateTestReport(aggregatedTestResult)
}