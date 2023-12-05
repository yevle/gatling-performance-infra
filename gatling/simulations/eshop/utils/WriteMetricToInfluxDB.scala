package eshop.utils

//import com.influxdb.client.InfluxDBClient
//import com.influxdb.client.domain.WritePrecision
//import com.influxdb.client.write.Point
import org.influxdb.InfluxDB
import org.influxdb.dto.Point

import io.gatling.core.Predef._
import io.gatling.core.structure.ChainBuilder

import java.util.concurrent.TimeUnit

//class WriteMetricToInfluxDB(org: String, bucket: String, client: InfluxDBClient) {
class WriteMetricToInfluxDB {

//  def writeError(requestName: String): ChainBuilder = {
//    exec(session => {
//      val statusCode = session("statusCode").as[String]
//      val responseBody = session("responseBody").as[String]
//      val testName = session("testName").as[String]
//
//      val point = Point
//        .measurement("Error")
//        .addTag("test_name", testName)
//        .addTag("request_name", requestName)
//        .addTag("status_code", statusCode)
//        .addTag("response_body", responseBody)
//        .time(Instant.now(), WritePrecision.NS)
//      writePointToDb(point)
//      session
//    })
//  }
//
//  private def writePointToDb(point: Point): Unit = {
//    val writeApi = client.getWriteApiBlocking
//    writeApi.writePoint(bucket, org, point)
//  }

  def writeError(influxdb: InfluxDB, testName: String, requestName: String): ChainBuilder = {
    exec(session => {
      val measurementName = "gatling"
      val fieldName = "value"
      val statusCode = session("statusCode").as[Int]
      val responseBody = session("responseBody").as[String]
      val error = s"$statusCode $responseBody"
      writeToInfluxDB(testName, requestName, error, measurementName, fieldName, influxdb)
      session
    })
  }

  private def writeToInfluxDB(testName: String, requestName: String, fieldValue: String, measurementName: String, fieldName: String, influxdb: InfluxDB): Unit = {
    val singleRequest = Point.measurement(measurementName)
      .time(System.currentTimeMillis(), TimeUnit.MILLISECONDS)
      .tag("testName", testName)
      .tag("requestName", requestName)
      .addField(fieldName, fieldValue)
      .build()
    val allRequests = Point.measurement(measurementName)
      .time(System.currentTimeMillis(), TimeUnit.MILLISECONDS)
      .tag("testName", testName)
      .tag("requestName", "allRequests")
      .addField(fieldName, fieldValue)
      .addField("requestValue", requestName)
      .build()

    influxdb.write(singleRequest)
    influxdb.write(allRequests)
  }
}