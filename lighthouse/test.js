import { after, describe, it } from "mocha";
import { sendMsg } from "./src/util/slack.js";
import { endSession, startLhFlowOpenMainPage, endTest } from "./src/session/session.js";
import assert from "assert";

export let flow
let mainPage

before(async () => {
    const message = 'Ui testing started.'
    console.log(message)
    await sendMsg(message)
})

beforeEach(async () => {
    mainPage = await startLhFlowOpenMainPage()
    flow = mainPage.flow
})

describe('Audit pages', () => {
    it('audit main and login', async () => {
        try {
            assert(await mainPage.isPageOpened(), 'Open main page')
            await mainPage.navigate()

            let loginPage = await mainPage.clickLoginLink()
            assert(await loginPage.isPageOpened(), 'Open login page')

            await loginPage.navigate()
            await loginPage.startTimespan()
            await loginPage.enterUsername(`${process.env.USER_NAME}`)
            await loginPage.enterPassword(`${process.env.USER_PASSWORD}`)
            await loginPage.endTimespan()
            await loginPage.snapshot()
        } finally {
            endSession()
        }
    }).retries(3)

    it('only main page', async () => {
        try {
            assert(await mainPage.isPageOpened(), "main page is open")
            await mainPage.navigate()
        } finally {
            endSession()
        }
    }).retries(3)

    it('only login page', async () => {
        try {
            let loginPage = await mainPage.clickLoginLink()
            assert(await loginPage.isPageOpened(), "login page is open")
            await loginPage.navigate()
        } finally {
            endSession()
        }
    }).retries(3)
})

after(async () => {
    await endTest()
    const message = 'Test run complete!!'
    console.log(message)
    await sendMsg(message)
})