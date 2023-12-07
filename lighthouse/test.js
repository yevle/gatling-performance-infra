import { LoginPage } from "./src/page/login-page.js";
import { MainPage } from "./src/page/main-page.js";
import { endSessionWithReport, startUserFlow } from "./src/session/session.js";
import assert from "assert";

async function auditMainPage() {
    const url = process.env.MAIN_PAGE
    const flow = await startUserFlow(url)
    let mainPage = new MainPage(flow)
    assert(await mainPage.isPageOpened(), 'Open main page')
    await flow.navigate(mainPage.getUrl())

    let loginPage = await mainPage.clickLoginLink()
    assert(await loginPage.isPageOpened(), 'Open login page')
    await flow.navigate(await loginPage.getUrl())

    await endSessionWithReport(flow)
}

async function startTest() {
    console.log('Test run started!')
    await auditMainPage()
    console.log('Test run complete!!')
}

await startTest()