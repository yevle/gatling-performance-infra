package eshop.utils

import org.influxdb.InfluxDB
import org.influxdb.dto.Point
import io.gatling.core.Predef._
import io.gatling.core.structure.ChainBuilder

import java.time.{LocalDateTime, ZoneOffset}
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

  def writeBuildNumber(influxdb: InfluxDB, buildNumber: Int, startTime:LocalDateTime) = {
      val measurementName = "gatling"
      val fieldName = "buildNumber"
      writeNumberToInflux(buildNumber, startTime, measurementName, fieldName, influxdb)
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

  private def writeNumberToInflux(buildNumber: Int, startTime: LocalDateTime, measurementName: String, fieldName: String, influxdb: InfluxDB): Unit = {
    val currentTime = System.currentTimeMillis()
    val point = Point.measurement(measurementName)
      .time(currentTime, TimeUnit.MILLISECONDS)
      .tag("testName", simulationName)
      .tag(fieldName, buildNumber.toString)
      .addField("startTime", startTime.toInstant(ZoneOffset.UTC).toEpochMilli.toString)
      .addField("finishTime", currentTime.toString)
      .build()

    influxdb.write(point)
  }

}