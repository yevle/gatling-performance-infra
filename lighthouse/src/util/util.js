import fs from 'fs'
import dotenv from 'dotenv'
import { expand } from 'dotenv-expand';
import { generateReport } from 'lighthouse';
import { writeMetricsToInflux, writeCategoryScoresToInflux } from './influxdb.js';

export const envConfig = dotenv.config({ path: `${process.cwd()}/.env`, override: true });
expand(envConfig);

export async function generateReportWriteMetrics(flow, writeToDb = true) {
    let date = new Date().getTime()
    const result = await flow.createFlowResult()

    if (`${process.env.WRITE_TO_DB}`) {
        await writeMetricsToInfluxDb(result)
    }
    if (!fs.existsSync(`${process.cwd()}/report`)) {
        fs.mkdirSync(`${process.cwd()}/report`)
    }
    if (!fs.existsSync(`${process.cwd()}/report/${date}`)) {
        fs.mkdirSync(`${process.cwd()}/report/${date}`)
    }
    await generateReportOfType(result, date)
}

async function writeMetricsToInfluxDb(result) {
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

async function generateReportOfType(result, date) {
    const reportType = `${process.env.REPORT_TYPE}`
    const jsonRep = generateReport(result, reportType)
    fs.writeFileSync(`${process.cwd()}/report/${date}/summary.${reportType}`, jsonRep);

    const steps = result.steps
    await steps.forEach(async step => {
        const stepReport = generateReport(step.lhr, reportType)
        const url = step.lhr.finalUrl
        const newUrl = url.replace(/\//g, ".")

        fs.writeFileSync(`${process.cwd()}/report/${date}/${newUrl}.${reportType}`, stepReport)
    })
}
