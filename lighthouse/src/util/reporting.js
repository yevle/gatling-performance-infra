import fs from 'fs'
import { generateReport } from 'lighthouse';
import { writeMetrics, writeScores } from './influxdb.js';
import { sendHtmlReport, sendReportUrl } from './slack.js';
import { flowConfig } from '../session/session.js';
import {performanceMetrics as metrics}  from './constant.js';

const date = new Date().getTime()
const allReportsDir = `${process.cwd()}/report`
const reportDir = `${allReportsDir}/${date}`
const reportType = `${process.env.REPORT_TYPE}`


export async function writeAggregatedMetrics(result) {
    if (process.env.WRITE_TO_DB) {
        await writeMetricsToInfluxDb(result)
    }
}

export async function generateTestReport(result) {
    if (process.env.CREATE_REPORT) {
        createReportDirectories()
        await generateReports(result)
    }
}

async function writeMetricsToInfluxDb(result) {
    const categories = flowConfig.config.settings.onlyCategories
    // const metrics = ['first-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'largest-contentful-paint', 'speed-index', 'interaction-to-next-paint']
    const steps = result.steps

    await steps.forEach(async step => {
        const fullUrl = step.lhr.finalDisplayedUrl
        const modifiedUrl = fullUrl.replace(`${process.env.BASE_URL}`, 'base_url/')
        const gatherMode = step.lhr.gatherMode

        categories.forEach(async category => {
            if (step.lhr.categories[category]) {
                const categoryScore = step.lhr.categories[category].score
                await writeScores(category, modifiedUrl, categoryScore, gatherMode)
            }
        })
        metrics.forEach(async metric => {
            if (step.lhr.audits[metric]) {
                const metricValue = step.lhr.audits[metric].numericValue
                await writeMetrics(metric, modifiedUrl, metricValue, gatherMode)
            }
        })
    })

}

async function generateReports(result) {
    await generateSummaryReport(result)
    // await generateReportForEachStep(result)
}

async function generateSummaryReport(result) {
    const reportPath = `${reportDir}/summary-${date}.${reportType}`
    const summaryReport = generateReport(result, reportType)
    fs.writeFileSync(reportPath, summaryReport);

    const report = {
        path: reportPath,
        comment: 'Test run complete.',
        title: `summary-${date}.${reportType}`
    }
    await sendReportSummary(report)
}

async function generateReportForEachStep(result) {
    const steps = result.steps
    await steps.forEach(async step => {
        const stepReport = generateReport(step.lhr, reportType)
        const url = step.lhr.finalDisplayedUrl
        const reportName = url.replace(/\//g, ".")
        fs.writeFileSync(`${reportDir}/${reportName}.${reportType}`, stepReport)
    })
}

async function sendReportSummary(report) {
    if (process.env.SEND_GRAFANA_LINK) {
        await sendReportUrl(`${process.env.GRAFANA_LINK}`)
    }
    if (process.env.SEND_REPORT_LINK) {
        const reportUrl = `${process.env.NGINX_HOST}/report/${date}/${report.title}`
        await sendReportUrl(reportUrl)
    }
    if (process.env.SEND_HTML_REPORT) {
        await sendHtmlReport(report)
    }
}

function createReportDirectories() {
    if (!fs.existsSync(allReportsDir)) {
        fs.mkdirSync(allReportsDir)
    }
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir)
    }
}
