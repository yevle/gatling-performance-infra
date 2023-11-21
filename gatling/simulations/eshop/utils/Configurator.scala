package eshop.utils

import com.typesafe.config.ConfigFactory
import java.util.concurrent.TimeUnit
import scala.concurrent.duration.FiniteDuration

object Configurator {
  val conf = ConfigFactory.load().withFallback(ConfigFactory.parseResources("application.conf"))

  val url: String = conf.getString("url")
//  val rampUpDurationSeconds = new FiniteDuration(conf.getInt("ramp-up-duration-seconds"), TimeUnit.SECONDS)
//  val steadyStateDurationSeconds = new FiniteDuration(conf.getInt("steady-state-duration-seconds"), TimeUnit.SECONDS)
  val rampUpDurationSeconds: Int = conf.getInt("ramp-up-duration-seconds")
  val steadyStateDurationSeconds: Int = conf.getInt("steady-state-duration-seconds")
  val usersRatePerSecond: Int = conf.getInt("users-rate-per-second")
  val concurrentUsersAmount: Int = conf.getInt("concurrent-users-amount")
  val paceMilliseconds: Int = conf.getInt("pace-milliseconds")

//  val testDurationMilliseconds = rampUpDurationSeconds.toMillis + steadyStateDurationSeconds.toMillis
}