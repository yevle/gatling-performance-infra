import graphite from 'graphite'

export async function writeMetrics(metric, url, metricValue, gatherMode) {
    var metric = {
        "lighthouse_metrics": {
            [gatherMode]: {
                [metric]: {
                    [url]: metricValue
                }
            }
        }
    }
    writeData(metric)
}

export async function writeScores(category, url, categoryScore, gatherMode) {
    var score = {
        "lighthouse_score": {
            [category]: {
                [gatherMode]: {
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
            client.end()
        }
    });
}