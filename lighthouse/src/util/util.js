import fs from 'fs'
import dotenv from 'dotenv'
import { expand } from 'dotenv-expand';
import { generateReport } from 'lighthouse';
import { writeToInfluxDBv2 } from './influxdb_v2.js';
import { writeMetricsToInflux, writeCategoryScoresToInflux } from './influxdb.js';

export const envConfig = dotenv.config({ path: `${process.cwd()}/.env`, override: true }); // to run with jenkins
expand(envConfig);

export async function generatReport(flow, writeToDb = true) {
    let date = new Date()
    const result = await flow.createFlowResult()

    if (writeToDb) {
        await writeFlowResultToInFluxDB(result)
        // await writeFlowResultToInFluxDBv2(result)
    }

    if (!fs.existsSync(`${process.cwd()}/report`)) {
        fs.mkdirSync(`${process.cwd()}/report`)
    }
    if (!fs.existsSync(`${process.cwd()}/report/${date}`)) {
        fs.mkdirSync(`${process.cwd()}/report/${date}`)
    }

    await generateJsonReport(result, date)
    await generateHtmlReport(result, date)

}

// async function writeFlowResultToInFluxDBv2(result) {
//     const steps = result.steps
//     await steps.forEach(async step => {
//         metrics.forEach(async metric => await writeToInfluxDBv2(step.lhr.finalUrl, step.lhr.audits[metric].numericValue, metric))
//     })
// }

async function writeFlowResultToInFluxDB(result) { //to do Map
    const categories = ['performance', 'best-practices', 'accessibility', 'seo']
    const metrics = ['first-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'largest-contentful-paint']
    const steps = result.steps

    await steps.forEach(async step => {
        const url = step.lhr.finalUrl

        categories.forEach(async category => {
            const categoryScore = step.lhr.categories[category].score
            await writeCategoryScoresToInflux('navigation-audit', category, url, categoryScore)
        })
        metrics.forEach(async metric => await writeMetricsToInflux('performance', metric, url, step.lhr.audits[metric].numericValue))
    })
}

async function generateJsonReport(result, date) {
    const jsonRep = generateReport(result, 'json')
    fs.writeFileSync(`${process.cwd()}/report/${date}/summary.json`, jsonRep);

    const steps = result.steps
    await steps.forEach(async step => {
        const stepReport = generateReport(step.lhr, 'json')
        const url = step.lhr.finalUrl
        const newUrl = url.replace(/\//g, "|")

        fs.writeFileSync(`${process.cwd()}/report/${date}/${newUrl}.json`, stepReport)
    })
}

async function generateHtmlReport(result, date) {
    const htmlRep = generateReport(result, 'html')
    fs.writeFileSync(`${process.cwd()}/report/${date}/summary.html`, htmlRep);

    const steps = result.steps
    await steps.forEach(async step => {
        const stepReport = generateReport(step.lhr, 'html')
        const url = step.lhr.finalUrl
        const newUrl = url.replace(/\//g, ".")

        fs.writeFileSync(`${process.cwd()}/report/${date}/${newUrl}.html`, stepReport)
    })
}