package eshop.requests

//import eshop.utils.{JsonFormatter, Randomizer, InfluxDBUtils}
import eshop.utils.{JsonFormatter, Randomizer}
import io.gatling.core.Predef.{jsonPath, _}
import io.gatling.core.structure.ChainBuilder
import io.gatling.http.Predef._
import io.gatling.http.request.builder.HttpRequestBuilder

object RemoveItemFromCart {
  /*
   Adding a randomly selected product to the cart
    */
  def removeItemFromCart(requestName: String): ChainBuilder = exec(
    setSessionVariables()
  ).exec(
    removeItemFromCartHttpRqBuilder(requestName)
      .check(
        status is 200,
        jsonPath (session => "$.removedProductId").is(session => session("selectedProductId").as[String])
      ).check(bodyString.saveAs("responseBody"))
    )

  val headers_general: Map[CharSequence, String] = Map(
    HttpHeaderNames.ContentType -> HttpHeaderValues.ApplicationJson,
    HttpHeaderNames.Accept -> HttpHeaderValues.ApplicationJson
  )

//  private def writeErrorToInfluxDB(): ChainBuilder = {
//    exec({
//      doIf(session => session("statusCode").as[Int] != 200) {
//        exec(session => {
//          val statusCode = session("statusCode").as[Int]
//          val responseMessage = session("yourHeader").as[String]
//          val requestHeaders = session("yourHeader").as[String].split(";").map(kv => {
//            val pair = kv.split(":")
//            pair(0) -> pair(1)
//          }).toMap
//          InfluxDBUtils.writeData(statusCode, responseMessage, requestHeaders)
//          session
//        })
//      }
//    })
//  }
  private def setSessionVariables(): ChainBuilder = exec(
    session =>
      session
        .set("selectedProductId", Randomizer.getIntFromSeq(session("productsInCart").as[Seq[Int]]))
  )

  private def removeItemFromCartHttpRqBuilder(requestName: String): HttpRequestBuilder =
    http(requestName)
      .delete("/eshop/control/cart/removeitem")
      .body(ElFileBody("requests/json/removeItemFromCart.json")).asJson
      .headers(headers_general)
}
