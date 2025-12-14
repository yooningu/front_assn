document.addEventListener("DOMContentLoaded", () => {
  // ?뒤의 값 가져오기
  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  renderHeader(category);
  loadProductList(category);
});

//  상품 리스트 로드
function loadProductList(category) {
  $.getJSON("./data/products.json", function (products) {
        let filtered = products;

    // 카테고리 필터
    if (category) {
      filtered = filtered.filter(p => p.category === category);
      $("#listTitle").text("카테고리: " + category.toUpperCase());
    } else { //카테고리 값이 없을 경우
      $("#listTitle").text("전체 상품");
    }

    renderProductList(filtered);

  }).fail(function () {
    $("#productList").html("<p>상품을 불러오지 못했습니다.</p>");
  });
}

/* ========================================
   상품 카드 출력
======================================== */
function renderProductList(items) {
  const container = $("#productList");
  container.empty();

  if (items.length === 0) {
    container.html("<p>해당 카테고리에 상품이 없습니다.</p>");
    return;
  }

  items.forEach(p => {
    const html = `
      <article class="product-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price.toLocaleString()}원</div>

        <!-- 🛒 장바구니 버튼 -->
        <button class="add-cart-btn" data-id="${p.id}">장바구니 담기</button>
      </article>
    `;
    container.append(html);
  });

  // ✅ 카드 클릭 → 상세 이동 (버튼 클릭 제외)
  container.off("click.card").on("click.card", ".product-card", function (e) {
    if ($(e.target).hasClass("add-cart-btn")) return;
    const id = $(this).data("id");
    location.href = `product.html?id=${id}`;
  });

  // ✅ 장바구니 버튼 클릭
  container.off("click.cart").on("click.cart", ".add-cart-btn", function (e) {
    e.stopPropagation();
    const id = $(this).data("id");
    addToCart(id);          // header.js에 있는 전역 함수 사용
    alert("장바구니에 담았습니다!");
  });
}
