package eshop.utils

import scala.concurrent.duration.FiniteDuration
import io.gatling.core.Predef._
import io.gatling.core.controller.inject.closed.ClosedInjectionStep
import io.gatling.core.controller.inject.open.OpenInjectionStep

object ScenarioInjector {
  def injectOpenModel (usersRatePerSecond: Int, rampUpDurationSeconds: FiniteDuration, steadyStateDurationSeconds: FiniteDuration)
    : Seq[OpenInjectionStep] = {
    Seq.apply(
      rampUsersPerSec(0) to usersRatePerSecond during rampUpDurationSeconds,
      constantUsersPerSec(usersRatePerSecond) during steadyStateDurationSeconds
    )
  }

  def injectClosedModel (concurrentUsersAmount: Int, rampUpDurationSeconds: FiniteDuration, steadyStateDurationSeconds: FiniteDuration): Seq[ClosedInjectionStep] = {
    Seq.apply(
      rampConcurrentUsers(0) to concurrentUsersAmount during rampUpDurationSeconds,
      constantConcurrentUsers(concurrentUsersAmount) during steadyStateDurationSeconds
    )
  }
}