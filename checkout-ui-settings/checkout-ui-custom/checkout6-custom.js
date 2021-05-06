window.onload = function () {
  const addCouponButton = document.querySelector('.summary-totalizers .summary-coupon-wrap')
  const addMoreProductsButton = document.querySelector('.link-choose-more-products-wrapper')

  addCouponButton.appendChild(addMoreProductsButton)

  document.getElementById('cart-to-orderform').innerText = document
    .getElementById('cart-to-orderform')
    .innerText.toUpperCase()
  document.getElementById('cart-choose-more-products').innerText = document
    .getElementById('cart-choose-more-products')
    .innerText.toUpperCase()
  document.querySelectorAll('#cart-link-coupon-add')[1].innerText = document
    .getElementById('cart-link-coupon-add')
    .innerText.toUpperCase()
}
