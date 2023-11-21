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
        .exec(OrderCreationChain.execute)
    }
  before(
    println(s"usersRatePerSecond: $usersRatePerSecond\nrampUpDurationSeconds: $rampUpDurationSeconds\nsteadyStateDurationSeconds: $steadyStateDurationSeconds")
  )
  def usersRatePerSecond: Int = getProperty("USERS_RATE_PS", Configurator.usersRatePerSecond.toString).toInt
  def rampUpDurationSeconds: Int = getProperty("RAMP_UP_DS", Configurator.rampUpDurationSeconds.toString).toInt
  def steadyStateDurationSeconds: Int = getProperty("STEADY_STATE_DS", Configurator.steadyStateDurationSeconds.toString).toInt

  private def getProperty(propertyName: String, defaultValue: String) = {
    Option(System.getenv(propertyName))
      .orElse(Option(System.getProperty(propertyName)))
      .getOrElse(defaultValue)
  }


  private val asserts = Seq(
    global.responseTime.percentile3.lte(5000)
  )

  setUp(
    orderCreation_OpenScenario.inject(ScenarioInjector.injectOpenModel(usersRatePerSecond, rampUpDurationSeconds, steadyStateDurationSeconds))
  )
    .assertions(asserts)
    .protocols(httpConf)
}