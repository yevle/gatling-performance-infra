package eshop

import eshop.chains.OrderCreationChain
import eshop.utils.Configurator
import eshop.utils.ScenarioInjector
import io.gatling.core.Predef._
import io.gatling.core.structure.ScenarioBuilder
import io.gatling.http.Predef._
import io.gatling.http.protocol.HttpProtocolBuilder

class ParameterizedScenario extends Simulation{
  private val httpConf: HttpProtocolBuilder = http
    .baseUrl(Configurator.url)

  private val orderCreation_OpenScenario: ScenarioBuilder =
    {
      scenario("OrderCreation_Scenario_OpenModel")
        .during(testDuration)(OrderCreationChain.execute)
    }
  before(
    println(s"userCount: $userCount\nrampUpDuration: $rampUpDuration\ntestDuration: $testDuration")
  )

  def userCount: Int = getProperty("USERS", Configurator.usersCount.toString).toInt

  def rampUpDuration: Int = getProperty("RAMP_DURATION", Configurator.rampUpDurationSeconds.toString).toInt

  def testDuration: Int = getProperty("TEST_DURATION", Configurator.testDurationSeconds.toString).toInt

  private def getProperty(propertyName: String, defaultValue: String) = {
    Option(System.getenv(propertyName))
      .orElse(Option(System.getProperty(propertyName)))
      .getOrElse(defaultValue)
  }


  private val asserts = Seq(
    global.responseTime.percentile3.lte(5000)
  )

  setUp(
    orderCreation_OpenScenario.inject(ScenarioInjector.injectOpenModel(userCount, rampUpDuration))
  )
    .assertions(asserts)
    .protocols(httpConf)
}