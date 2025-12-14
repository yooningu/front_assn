

// 로딩후 실행
document.addEventListener("DOMContentLoaded", function () {
  // 헤더 렌더링 
  renderHeader();

  // 추천 상품 읽기
  loadRecommendedProducts();

  // 슬라이더 버튼 이벤트
  setupRecommendSlider();
});








//  추천 상품 로딩
function loadRecommendedProducts() {
    // 제이슨 파일 읽기
  $.getJSON("data/products.json", function (products) {
    allProducts = products;

    originalRecommend = products.slice(0, 7); // 처음 추천 7개
    renderRecommendList(originalRecommend);
  });
}





//  추천 영역 렌더링만 담당하는 함수
function renderRecommendList(list) {
  const $track = $("#recommend-track");
  let html = "";

  list.forEach((p) => {
    html += `
      <article class="product-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price.toLocaleString()}원</div>

        <!--  장바구니 버튼 -->
        <button class="add-cart-btn" data-id="${p.id}">
          장바구니 담기
        </button>
      </article>
    `;
  });

  $track.html(html);

  //  카드 클릭 → 상세페이지 이동
  $track.off("click.card").on("click.card", ".product-card", function (e) {
    // 버튼 클릭은 막기
    if ($(e.target).hasClass("add-cart-btn")) return;
    const id = $(this).data("id");
    window.location.href = `product.html?id=${id}`;
  });

  // 장바구니 버튼 클릭
  $track.off("click.cart").on("click.cart", ".add-cart-btn", function (e) {
    const id = $(this).data("id");
    addToCart(id);
    alert("장바구니에 담았습니다!");
  });

  // 제목 변경
  const titleEl = document.querySelector(".section-recommend h2");
  if (titleEl) {
    titleEl.textContent = list === originalRecommend ? "추천 상품" : "검색 결과";
  }
}







//  헤더에서 부를 검색 함수 
window.searchByName = function (keyword) {
  if (!keyword) {
    renderRecommendList(originalRecommend);
    return;
  }

  const lower = keyword.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(lower)
  );

  // 검색 결과가 없으면 간단한 메시지 하나 보여주기
  if (filtered.length === 0) {
    const $track = $("#recommend-track");
    $track.html(`<p>“${keyword}”에 해당하는 상품이 없습니다.</p>`);
    const titleEl = document.querySelector(".section-recommend h2");
    if (titleEl) titleEl.textContent = "검색 결과";
    return;
  }

  renderRecommendList(filtered);
};

//  슬라이더 (그대로 사용)
function setupRecommendSlider() {
  const $window = $(".recommend-slider-window");

  $(".slider-next").on("click", function () {
    const w = $window.width();
    $window.animate({ scrollLeft: $window.scrollLeft() + w * 0.7 }, 300);
  });

  $(".slider-prev").on("click", function () {
    const w = $window.width();
    $window.animate({ scrollLeft: $window.scrollLeft() - w * 0.7 }, 300);
  });
}
