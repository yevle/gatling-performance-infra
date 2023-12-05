package eshop.utils
import org.influxdb.InfluxDB
import org.influxdb.dto.Point

import io.gatling.core.Predef._
import io.gatling.core.structure.ChainBuilder

import java.util.concurrent.TimeUnit

class WriteMetricToInfluxDB(simulationName: String) {

  def writeError(influxdb: InfluxDB, requestName: String): ChainBuilder = {
    exec(session => {
      val measurementName = "gatling"
      val fieldName = "value"
      val statusCode = session("statusCode").as[Int]
      val responseBody = session("responseBody").as[String]
      val error = s"$statusCode $responseBody"
      writeToInfluxDB(requestName, error, measurementName, fieldName, influxdb)
      session
    })
  }

  private def writeToInfluxDB(requestName: String, fieldValue: String, measurementName: String, fieldName: String, influxdb: InfluxDB): Unit = {
    val singleRequest = Point.measurement(measurementName)
      .time(System.currentTimeMillis(), TimeUnit.MILLISECONDS)
      .tag("testName", simulationName)
      .tag("requestName", requestName)
      .addField(fieldName, fieldValue)
      .build()
    val allRequests = Point.measurement(measurementName)
      .time(System.currentTimeMillis(), TimeUnit.MILLISECONDS)
      .tag("testName", simulationName)
      .tag("requestName", "allRequests")
      .addField(fieldName, fieldValue)
      .addField("requestValue", requestName)
      .build()

    influxdb.write(singleRequest)
    influxdb.write(allRequests)
  }
}