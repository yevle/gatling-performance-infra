import graphite from 'graphite'

export async function writeMetricsToInflux(auditCategory, metricName, url, metricValue) {
    var metric = {
        lighthouse: {
            [auditCategory]: {
                [metricName]: {
                    [url]: metricValue
                }
            }
        }
    }
    writeData(metric)
}

export async function writeCategoryScoresToInflux(flowType, categoryName, url, categoryScore) {
    var score = {
        lighthouse: {
            [flowType]: {
                [categoryName]: {
                    [url]: categoryScore
                }
            }
        }
    }
    writeData(score)
}

function writeData(data) {
    var client = graphite.createClient(`${process.env.GRAPHITE_URL}`);
    client.write(data, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log('Data written')
            client.end()
            console.log('Connection closed')
        }
    });
}