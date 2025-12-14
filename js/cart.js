document.addEventListener("DOMContentLoaded", () => {
  renderHeader(); // 헤더 표시
  loadCart();     // 장바구니 표시
});

let productsCache = [];

/* ===============================
   장바구니 로드 + 렌더링
================================ */
function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  $.getJSON("data/products.json", function (products) {
    productsCache = products;

    const $listEl = $("#cartList");
    $listEl.empty();

    if (cart.length === 0) {
      $listEl.html("<p>장바구니가 비었습니다.</p>");
      updateCartCount();
      updateTotal();
      return;
    }

    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return;

      const $div = $(`
        <div class="cart-item">
          <img src="${product.image}" class="cart-item-img" />

          <div class="cart-item-info">
            <h4>${product.name}</h4>
            <p>${product.price.toLocaleString()}원</p>
          </div>

          <div class="cart-item-qty">
            <button class="qty-btn minus">-</button>
            <span class="qty">${item.qty}</span>
            <button class="qty-btn plus">+</button>
          </div>

          <button class="remove-btn">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      `);

      $listEl.append($div);

      // 수량 증가
      $div.find(".plus").on("click", function () {
        updateQty(product.id, item.qty + 1);
      });

      // 수량 감소
      $div.find(".minus").on("click", function () {
        if (item.qty > 1) {
          updateQty(product.id, item.qty - 1);
        }
      });

      // 삭제
      $div.find(".remove-btn").on("click", function () {
        removeItem(product.id);
      });
    });

    lucide.createIcons();
    updateTotal();
  });
}

/* ===============================
   수량 변경
================================ */
function updateQty(productId, newQty) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty = newQty;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  loadCart();
}

/* ===============================
   개별 삭제
================================ */
function removeItem(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(i => i.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  loadCart();
}

/* ===============================
   총 금액 업데이트
================================ */
function updateTotal() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  cart.forEach(item => {
    const p = productsCache.find(prod => prod.id === item.id);
    if (p) total += p.price * item.qty;
  });

  $("#cartTotalPrice").text(total.toLocaleString());
}

/* ===============================
   모두 구매하기
================================ */
$("#btnPurchaseAll").on("click", function () {
  alert("구매가 완료되었습니다");
  localStorage.removeItem("cart");
  updateCartCount();
  loadCart();
});
