package eshop.requests

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
