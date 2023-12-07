import graphite from 'graphite'

export async function writeMetricsToInflux(auditType, measurement, metricName, url, metricValue) {
    var metric = {
        lighthouse: {
            [auditType]: {
                [measurement]: {
                    [url]: {
                        [metricName]: metricValue
                    }
                }
            }
        }
    }
    writeData(metric)
}

export async function writeCategoryScoreToInflux(auditType, measurement, categoryName, url, categoryScore) {
    var score = {
        lighthouse: {
            [auditType]: {
                [measurement]: {
                    [url]: {
                        [categoryName]: categoryScore
                    }
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
            client.end()
        }
    });
}