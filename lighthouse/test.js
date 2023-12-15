import { after, describe, it } from "mocha";
import { LoginPage } from "./src/page/login-page.js";
import { MainPage } from "./src/page/main-page.js";
import { endSession, startLhFlowOpenMainPage, collectResult } from "./src/session/session.js";
import assert from "assert";

let mainPage

beforeEach(async () => {
    mainPage = await startLhFlowOpenMainPage()
})

describe('audit pages', () => {
    it('audit main and login', async () => {
        assert(await mainPage.isPageOpened(), 'Open main page')
        await mainPage.flow.navigate(mainPage.url)

        let loginPage = await mainPage.clickLoginLink()
        assert(await loginPage.isPageOpened(), 'Open login page')
        await loginPage.flow.navigate(loginPage.url)
        await loginPage.flow.startTimespan()
        await loginPage.enterUsername(`${process.env.USER_NAME}`)
        await loginPage.enterPassword(`${process.env.USER_PASSWORD}`)
        await loginPage.flow.endTimespan()
        await loginPage.flow.snapshot()

        collectResult(loginPage.flow)
    }).retries(3)

    it('only main page', async () => {
        assert(await mainPage.isPageOpened(), "main page is open")
        await mainPage.flow.navigate(mainPage.url)

        collectResult(mainPage.flow)
    }).retries(3)

    it('only login page', async () => {
        const loginPage = await mainPage.clickLoginLink()
        assert(await loginPage.isPageOpened(), "login page is open")
        await loginPage.flow.navigate(loginPage.url)
        
        collectResult(loginPage.flow)
    }).retries(3)
})

after(async () => {
    await endSession()
    console.log('Test run complete!!')
})