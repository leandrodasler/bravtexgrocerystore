;(function (h, o, t, j, a, r) {
  h.hj =
    h.hj ||
    function () {
      ;(h.hj.q = h.hj.q || []).push(arguments)
    }
  h._hjSettings = { hjid: 2425196, hjsv: 6 }
  a = o.getElementsByTagName('head')[0]
  r = o.createElement('script')
  r.async = 1
  r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
  a.appendChild(r)
})(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')

function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector))
    }
    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector))
        observer.disconnect()
      }
    })
    observer.observe(document.body, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true,
    })
  })
}

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

const SELLER_COLORS = {
  'color-0': '#f0f6ff',
  'color-1': '#fff6e0',
  'color-2': '#beffa5',
  'color-3': '#eeeeee',
}

const SELLER_COLORS_LENGTH = Object.keys(SELLER_COLORS).length

function checkImage(imageSrc, ok, fail) {
  var img = new Image()
  img.onload = ok
  img.onerror = fail
  img.src = imageSrc
}

function getCartSellers() {
  return vtexjs?.checkout?.orderForm?.sellers
}

function getCartItems() {
  return vtexjs?.checkout?.orderForm?.items
}

function getCartItemBySkuId(skuId) {
  return getCartItems()?.find((item) => item.id === skuId.toString())
}

function getSellerBySkuId(skuId) {
  return getCartSellers()?.find((seller) => seller.id === getCartItemBySkuId(skuId)?.seller)
}

function groupedSellers2() {
  const itemsElements = document.querySelectorAll(
    '.cart-template.full-cart .cart-template-holder .cart-items .product-item'
  )

  itemsElements.forEach((itemElement) => {
    const skuId = $(itemElement).attr('data-sku')
    const sku = getCartItemBySkuId(skuId)
    const seller = getSellerBySkuId(skuId)
    const sellerName = seller?.name
    console.log('SKU    |', sku.id, ' - ', sku.name)
    console.log('Seller |', JSON.stringify(seller))
    console.log('----------------------------------')
  })
}

function groupSellers() {
  const sellers = document.querySelectorAll('[data-bind="text: sellerName"]')
  const groupedSellers = {}
  const skuSellerMap = {}
  let lastRandomColorIndices = []

  sellers.forEach((s) => {
    const sellerName = s.innerHTML
    const sellerSlug = slugify(sellerName)
    const parentRow = $(s).parents('tr')
    const sku = parentRow.attr('data-sku')

    s.classList.add(sellerSlug)
    parentRow.addClass(sellerSlug)

    skuSellerMap[sku] = { sellerName, sellerSlug }

    if (!groupedSellers[sellerSlug]) {
      parentRow.addClass('first')
      groupedSellers[sellerSlug] = true

      const sellerImageUrl = encodeURI(`/arquivos/${sellerName}.svg?timestamp=${Date.now()}`)

      checkImage(
        sellerImageUrl,
        function () {
          const colorThief = new ColorThief()

          $(`<img src="${sellerImageUrl}" crossorigin="anonymous" />`).load((e) => {
            const dominantColorArray = colorThief.getPalette(e.target, 2)[0]
            const dominantColor = `rgba(${dominantColorArray}, 0.15)`

            if (!$(`.table.cart-items tbody tr.${sellerSlug}.first div.sellerInfo`).length) {
              $(`.table.cart-items tbody tr.${sellerSlug}.first`).prepend(
                $(`
                <div class="sellerInfo">
                  Produtos de <img src="${sellerImageUrl}" alt="${sellerName}" crossorigin="anonymous" />
                </div>
              `)
              )
            }

            $('head').append(`<style>
              .orderform-template .cart-template.mini-cart .item .sellerNameMinicart.${sellerSlug},
              .${sellerSlug}[data-bind="text: sellerName"] {
                background-color: ${dominantColor};
              }
            </style>`)
          })
        },
        function () {
          let randomColorIndex = 'color-' + Math.floor(Math.random() * SELLER_COLORS_LENGTH)
          if (lastRandomColorIndices.length > 0 && lastRandomColorIndices.length < SELLER_COLORS_LENGTH) {
            while (lastRandomColorIndices.includes(randomColorIndex)) {
              randomColorIndex = 'color-' + Math.floor(Math.random() * SELLER_COLORS_LENGTH)
            }
          }
          lastRandomColorIndices.push(randomColorIndex)
          const randomSellerColor = SELLER_COLORS[randomColorIndex]

          if (!$(`.table.cart-items tbody tr.${sellerSlug}.first div.sellerInfo`).length) {
            $(`.table.cart-items tbody tr.${sellerSlug}.first`).prepend(
              $(`
              <div class="sellerInfo">
                Produtos de <span class="sellerName">${sellerName}</span>
              </div>
            `)
            )
          }

          $('head').append(`<style>
            .orderform-template .cart-template.mini-cart .item .sellerNameMinicart.${sellerSlug},
            .${sellerSlug}[data-bind="text: sellerName"] {
              background-color: ${randomSellerColor};
            }
          </style>`)
        }
      )
    }
  })

  window.setInterval(() => {
    const itemsMinicart = document.querySelectorAll('.orderform-template .cart-template.mini-cart .item')
    itemsMinicart.forEach((item) => {
      if (skuSellerMap) {
        if (!$(item).find('.sellerNameMinicart').length) {
          const sku = $(item).attr('data-sku')
          const shippingElement = $(item).find('.shipping-date')
          const shippingText = shippingElement.text()
          shippingElement.html(`<strong>${shippingText.charAt(0).toUpperCase() + shippingText.slice(1)}</strong> por:`)

          $(item).find('.description').append(`
            <div class="sellerNameMinicart ${skuSellerMap[sku]?.sellerSlug}">
              ${skuSellerMap[sku]?.sellerName}
            </div>
          `)
        }
      }
    })
  }, 100)
}

window.addEventListener('DOMContentLoaded', () => {
  $('body').append(
    `<script src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js"></script>`
  )

  $(window).on('orderFormUpdated.vtex ', (e) => {
    if (!$('.demo-store-warning').length) {
      const demoWarning = `<div class="demo-store-warning">
        <div class="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.3333 12.6667V10.6667H10.6667H8.66667V12.6667H10.6667V15.3333H8.66667V17.3333H10.6667H13.3333H15.3333V15.3333H13.3333V12.6667ZM12 9.33333C13.104 9.33333 14 8.43733 14 7.33333C14 6.22933 13.104 5.33333 12 5.33333C10.896 5.33333 10 6.22933 10 7.33333C10 8.43733 10.896 9.33333 12 9.33333ZM12 22C6.48533 22 2 17.5147 2 12C2 6.48533 6.48533 2 12 2C17.5147 2 22 6.48533 22 12C22 17.5147 17.5147 22 12 22ZM12 0C5.372 0 0 5.372 0 12C0 18.628 5.372 24 12 24C18.628 24 24 18.628 24 12C24 5.372 18.628 0 12 0Z"
              fill="currentColor"
            />
            <mask
              id="mask0_1425_16444"
              style="mask-type: alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="24"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.3333 12.6667V10.6667H10.6667H8.66667V12.6667H10.6667V15.3333H8.66667V17.3333H10.6667H13.3333H15.3333V15.3333H13.3333V12.6667ZM12 9.33333C13.104 9.33333 14 8.43733 14 7.33333C14 6.22933 13.104 5.33333 12 5.33333C10.896 5.33333 10 6.22933 10 7.33333C10 8.43733 10.896 9.33333 12 9.33333ZM12 22C6.48533 22 2 17.5147 2 12C2 6.48533 6.48533 2 12 2C17.5147 2 22 6.48533 22 12C22 17.5147 17.5147 22 12 22ZM12 0C5.372 0 0 5.372 0 12C0 18.628 5.372 24 12 24C18.628 24 24 18.628 24 12C24 5.372 18.628 0 12 0Z"
                fill="white"
              />
            </mask>
            <g mask="url(#mask0_1425_16444)">
              <rect x="-20" y="-20" width="64" height="64" fill="currentColor" />
            </g>
          </svg>
        </div>
        Atenção! Esta é uma loja de demonstração da plataforma VTEX. Os produtos, preços e entregas são meramente
        ilustrativos.
      </div>`

      $('.cart-template.full-cart .summary-template-holder').append(demoWarning)
      $('.cart-template.mini-cart .custom-cart-template-wrap').append(demoWarning)
    }

    if (!$('#continue-shopping-button').length) {
      $('.btn-place-order-wrapper').append(
        $(
          '<a href="/" target="_self" id="continue-shopping-button" class="btn btn-large btn-secondary">Continuar comprando</a>'
        )
      )
    }

    if (!$('.minicart-title').length) {
      waitForElement('.orderform-template .cart-template.mini-cart .custom-cart-template-wrap').then(() =>
        $('.orderform-template .cart-template.mini-cart .custom-cart-template-wrap').append(
          $(`
          <div class="minicart-title">
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 20.0001H15.92C16.2746 20.0003 16.6179 19.8749 16.8889 19.646C17.1598 19.4172 17.3409 19.0998 17.4 18.7501L20 3.25007C20.0601 2.89349 20.2471 2.57064 20.5264 2.34096C20.8057 2.11127 21.1585 1.99021 21.52 2.00007H22.52" stroke="#000711" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.81396 23.0098C7.60686 23.0098 7.43896 22.8419 7.43896 22.6348C7.43896 22.4277 7.60686 22.2598 7.81396 22.2598" stroke="#000711" stroke-width="1.5"/>
              <path d="M7.81396 23.0098C8.02107 23.0098 8.18896 22.8419 8.18896 22.6348C8.18896 22.4277 8.02107 22.2598 7.81396 22.2598" stroke="#000711" stroke-width="1.5"/>
              <path d="M15.3848 23.0098C15.1777 23.0098 15.0098 22.8419 15.0098 22.6348C15.0098 22.4277 15.1777 22.2598 15.3848 22.2598" stroke="#000711" stroke-width="1.5"/>
              <path d="M15.3848 23.0098C15.5919 23.0098 15.7598 22.8419 15.7598 22.6348C15.7598 22.4277 15.5919 22.2598 15.3848 22.2598" stroke="#000711" stroke-width="1.5"/>
              <path d="M18.0002 15.5H5.88022C5.21672 15.4934 4.57413 15.267 4.05301 14.8563C3.53189 14.4455 3.16165 13.8736 3.00022 13.23L1.52022 7.43C1.49506 7.31959 1.49456 7.20499 1.51876 7.09437C1.54296 6.98374 1.59126 6.87982 1.66022 6.79C1.73009 6.70003 1.81953 6.62716 1.92176 6.57691C2.02398 6.52666 2.13631 6.50036 2.25022 6.5H19.4802" stroke="#000711" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.0003 6.50029L14.2503 2.75029C13.8964 2.39977 13.4184 2.20312 12.9203 2.20312C12.4222 2.20312 11.9442 2.39977 11.5903 2.75029L7.84033 6.50029" stroke="#000711" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10.51 3.83986L6.11 2.54986C5.87429 2.47951 5.62698 2.45661 5.38236 2.48249C5.13775 2.50837 4.90069 2.58251 4.68493 2.70063C4.46916 2.81874 4.27896 2.97848 4.12535 3.1706C3.97173 3.36271 3.85775 3.58339 3.79 3.81986L3 6.49986" stroke="#000711" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Meu Carrinho
          </div>
        `)
        )
      )
    }

    const htmlCartToOrderForm = `
        PROSSEGUIR
        <svg width="14" height="12" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.9142 4.58594L8.62115 0.292942L7.20715 1.70694L10.5002 4.99994H0.500153V6.99994H10.5002L7.20715 10.2929L8.62115 11.7069L12.9142 7.41394C13.2891 7.03889 13.4997 6.53027 13.4997 5.99994C13.4997 5.46961 13.2891 4.961 12.9142 4.58594Z" fill="white"/>
        </svg>
      `
    window.setInterval(
      () => waitForElement('#cart-to-orderform').then(() => $('#cart-to-orderform').html(htmlCartToOrderForm)),
      100
    )

    groupSellers()
  })
})
