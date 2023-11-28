package eshop.utils

import org.influxdb.InfluxDBFactory
import org.influxdb.InfluxDB
import io.gatling.core.Predef._
import io.gatling.core.structure.ChainBuilder

object DbClient {
  val url = "http://localhost:8653"
  val username = "admin"
  val password = "admin"
  val database = "graphite"

  val influxDB: InfluxDB = InfluxDBFactory.connect(url, username, password)
  influxDB.setDatabase(database)
  val metricWriter = new WriteMetricToInfluxDB()

  def writeMetricWriter(testName: String, requestName: String): ChainBuilder = {
    doIf(session => {
      session("statusCode").as[Int] != 200
    }) {
      metricWriter.writeError(influxDB, testName, requestName)
    }
  }
}