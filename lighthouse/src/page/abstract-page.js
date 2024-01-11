
export class AbstractPage {

    /**
     * @param {import("lighthouse").UserFlow} flow 
     */
    constructor(flow) {
        this.flow = flow
        this.url = this.flow._page.url()
        this.pageHeader = 'default'
        this.pageHeaderSelector = 'h2'
    }

    async isPageOpened() {
        const header = await this.flow._page.$eval(this.pageHeaderSelector, el => el.textContent)
        return header == this.pageHeader
    }

    async navigate() {
        await this.flow.navigate(this.url)
    }

    async snapshot() {
        await this.flow.snapshot()
    }

    async startTimespan() {
        await this.flow.startTimespan()
    }

    async endTimespan() {
        await this.flow.endTimespan()
    }
}