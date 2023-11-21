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
        jsonPath (session => "$.removedProductId").is(session => session("selectedProductId").as[String]),
        jsonPath("$.cartInfo.cartItems[*].product.id").findAll.transform(ids => ids.exists(_ == 3)).is(false) // Check if 3 is not present in idList
      ).check(bodyString.saveAs("responseBody"))
  ).exec(session => {
      val responseBody = session("responseBody").as[String] // Retrieve the response body from the session
      println(s"------Response Body /eshop/control/cart/removeitem: ------\n" + JsonFormatter.formatJson(responseBody)) // Print the response body

      session
    })

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