package eshop.chains

import io.gatling.core.Predef._
import io.gatling.core.structure.ChainBuilder
import eshop.requests.{AddItemToCart, GetCartInfo, GetCategories, GetCategoryProducts, GetIndexPage, RemoveItemFromCart, SubmitPurchase, UpdateQuantity}

object OrderCreationChain {
  val execute: ChainBuilder = exec(
    exec(
      GetIndexPage.getIndexPage("01_getIndexPage"),
      GetCategories.getCategories("02_getCategories"),
      GetCategoryProducts.getCategoryProducts("03_getCategoryProducts"),
      AddItemToCart.addItemToCart("04_addItemToCart"),
      GetCategoryProducts.getCategoryProducts("05_getCategoryProducts"),
      AddItemToCart.addItemToCart("06_addItemToCart"),
      GetCartInfo.getCartInfo("07_getCartInfo"),
      UpdateQuantity.updateQuantity("08_updateQuantity"),
      GetCartInfo.getCartInfo("09_getCartInfo"),
      RemoveItemFromCart.removeItemFromCart("10_removeItemFromCart"),
      SubmitPurchase.submitPurchase("11_submitPurchase")
    )
  )
}