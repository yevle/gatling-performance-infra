import fs from 'fs'
import dotenv from 'dotenv'
import { expand } from 'dotenv-expand';
import { generateReport } from 'lighthouse';
import { writeToInfluxDBv2 } from './influxdb_v2.js';
import { writeMetricsToInflux, writeCategoryScoresToInflux } from './influxdb.js';

export const envConfig = dotenv.config({ path: `${process.cwd()}/.env`, override: true }); // to run with jenkins
expand(envConfig);

export async function generatReport(flow) {
    let date = new Date()
    const result = await flow.createFlowResult()

    if (`${process.env.WRITE_TO_DB}`) {
        await writeFlowResultToInFluxDB(result)
        // await writeFlowResultToInFluxDBv2(result)
    }
    // const jsonRep = generateReport(result, 'json')
    const htmlRep = generateReport(result, 'html')
    // fs.writeFileSync(`${process.cwd()}/report/lhreport-${date.getTime()}.json`, jsonRep);
    fs.writeFileSync(`${process.cwd()}/report/lhreport-${date.getTime()}.html`, htmlRep);
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
