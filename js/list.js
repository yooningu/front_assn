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
    } else {
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
      <div class="product-card" onclick="location.href='product.html?id=${p.id}'">
        <img src="${p.image}" alt="${p.name}">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price.toLocaleString()}원</div>
      </div>
    `;
    container.append(html);
  });
}
