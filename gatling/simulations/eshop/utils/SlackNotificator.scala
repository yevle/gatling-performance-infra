package eshop.utils

import io.gatling.core.Predef._
import io.gatling.core.structure.{ChainBuilder, ScenarioBuilder}
import io.gatling.http.Predef._
import io.gatling.http.protocol.HttpProtocolBuilder

object SlackNotificator {
  private val startMessage = """{ "message": "Test started\n
                               |To watch simulation stats in runtime follow the link:\n
                               |http://127.0.0.1:8857/d/gatling/gatling-report-metrics?from=now-5m&refresh=5s" }""".stripMargin
  private val finishMessage = """{ "message": "Test finished" }"""
  private val slackMessage = """{ "message": "completed!!!" }"""

  private val slackDomain = "https://hooks.slack.com/"
  private val channelId = "triggers/T4E815KGA/6273744595475/f6ca30500eb4b1d2761fcccc20f7d99b"

  private val slackProtocol: HttpProtocolBuilder = http
    .baseUrl(slackDomain) // Your Slack Webhook URL

  def sendSlackNotification(): ChainBuilder = doIf(session => {
    session("statusCode").as[Int] != 200
  }) {
    exec(http("slack notification")
      .post(slackDomain + channelId)
      .body(StringBody(startMessage)).asJson
    )
  }

  //  def sendNotificationAboutFails(listOfFails: List[(Int, String, String)]): ChainBuilder =
  def sendNotificationAboutFails(): ChainBuilder =
    exec(http("slack notification")
      .post(slackDomain + channelId)
      //      .body(StringBody(listOfFails.toString())).asJson
      .body(StringBody(slackMessage)).asJson
    )

  def sendNotificationAboutStart(): ScenarioBuilder = {
    scenario("Start test notification")
      .exec(http("Slack Webhook")
        .post(channelId) // Append your actual webhook path
        .body(StringBody(startMessage))
        .header("Content-Type", "application/json")
        .check(status.is(200)))
  }

  def sendNotificationAboutFinish(): ScenarioBuilder = {
    scenario("Finish test notification")
      .exec(http("Slack Webhook")
        .post(channelId) // Append your actual webhook path
        .body(StringBody(finishMessage))
        .header("Content-Type", "application/json")
        .check(status.is(200)))
  }

  def getSlackHTTPProtocol: HttpProtocolBuilder = {
    slackProtocol
  }

}