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

  fetch("data/products.json")
  // 비동기
    .then(res => res.json())
    .then(products => {
      productsCache = products;

      const listEl = document.getElementById("cartList");
      listEl.innerHTML = "";

      if (cart.length === 0) {
        listEl.innerHTML = `<p>장바구니가 비었습니다.</p>`;
        updateCartCount();
        updateTotal();
        return;
      }

      cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
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
        `;

        listEl.appendChild(div);

        // 수량 증가
        div.querySelector(".plus").addEventListener("click", () => {
          updateQty(product.id, item.qty + 1);
        });

        // 수량 감소
        div.querySelector(".minus").addEventListener("click", () => {
          if (item.qty > 1) {
            updateQty(product.id, item.qty - 1);
          }
        });

        // 삭제
        div.querySelector(".remove-btn").addEventListener("click", () => {
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

  document.getElementById("cartTotalPrice").textContent = total.toLocaleString();
}

/* ===============================
   모두 구매하기
================================ */
document.getElementById("btnPurchaseAll")?.addEventListener("click", () => {
  alert("구매가 완료되었습니다");
  localStorage.removeItem("cart");
  updateCartCount();
  loadCart();
});
