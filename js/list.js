document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const search   = params.get("search");

  // 헤더 렌더링 (카테고리 강조용)
  renderHeader(category);

  console.log("list.js 시작 / category:", category, "search:", search);

  loadProductList(category, search);
});

/* ========================================
   상품 리스트 로드
======================================== */
function loadProductList(category, search) {
  $.getJSON("./data/products.json", function (products) {
    console.log("JSON 로드 성공:", products);

    let filtered = products;

    // 카테고리 필터
    if (category) {
      filtered = filtered.filter(p => p.category === category);
      $("#listTitle").text("카테고리: " + category.toUpperCase());
    }

    // 검색 필터 (?search=...)
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
      $("#listTitle").text(`검색 결과: "${search}"`);
    }

    renderProductList(filtered);

  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.error("JSON 로드 실패:", textStatus, errorThrown);
    console.error("HTTP status:", jqXHR.status);
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
    container.html("<p>일치하는 상품이 없습니다.</p>");
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
