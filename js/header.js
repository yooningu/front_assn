function renderHeader(activeCategory) {
  // 변수 headerHTML생성
  const headerHTML = `
    <header class="site-header">
      <div class="header-inner">

        <!-- 왼쪽: 로고 + 메뉴 -->
        <div class="header-left">
          <div class="logo"><a href="index.html">SAMSUNG</a></div>

          <nav class="main-nav">
            <a href="list.html?category=mobile" data-cat="mobile">모바일</a>
            <a href="list.html?category=pc" data-cat="pc">PC/주변기기</a>
            <a href="list.html?category=living" data-cat="living">리빙가전</a>
            <a href="list.html?category=kitchen" data-cat="kitchen">주방가전</a>
            <a href="list.html?category=tv" data-cat="tv">TV/영상 음향</a>
          </nav>
        </div>





        

        <!-- 오른쪽 아이콘들 -->
        <div class="header-right">

          <!-- 검색  -->
          <div class="header-search">
            <input type="text" id="headerSearchInput" placeholder="제품 검색">
            <button class="search-btn" id="btnSearch">
              <i data-lucide="search"></i>
            </button>
          </div>

          <!-- 장바구니 -->
          <button class="icon-btn cart" id="btnCart">
            <i data-lucide="shopping-cart"></i>
            <span class="cart-count" id="cartCount"></span>
          </button>

          <!-- 로그인 -->
          <button class="icon-btn" id="btnLogin">
            <i data-lucide="user"></i>
          </button>

          <!-- 모바일 메뉴 -->
          <button class="icon-btn icon-menu" id="btnMenu">
            <i data-lucide="menu"></i>
          </button>

        </div>
      </div>






      <!-- 모바일 메뉴 패널(평소에 숨겨둠) -->
      <div class="mobile-menu-panel" id="mobileMenuPanel">
        <ul class="mobile-menu-list">
          <li><a href="list.html?category=mobile">모바일</a></li>
          <li><a href="list.html?category=pc">PC/주변기기</a></li>
          <li><a href="list.html?category=living">리빙가전</a></li>
          <li><a href="list.html?category=kitchen">주방가전</a></li>
          <li><a href="list.html?category=tv">TV/영상 음향</a></li>
          <li><a href="cart.html">장바구니</a></li>
        </ul>
      </div>

    </header>
  `;
// 가장 위에 넣는다 afterbegin가 가장위라는 뜻
  document.body.insertAdjacentHTML("afterbegin", headerHTML);

  // lucide 아이콘 렌더링
  if (window.lucide) window.lucide.createIcons();

  // 카테고리 강조 표시
  if (activeCategory) {
    const link = document.querySelector(`.main-nav a[data-cat="${activeCategory}"]`);
    if (link) {
      link.style.color = "#0066d9";
      link.style.fontWeight = "600";
    }
  }
// 버튼기능 활성화
  setupHeaderEvents();
  // 장바구니 수량 표시
  updateCartCount();
}


// 헤더 이벤트 처리------------------------------------------------
function setupHeaderEvents() {
  const searchInput = document.getElementById("headerSearchInput");
  const searchBtn   = document.getElementById("btnSearch");
  const btnMenu     = document.getElementById("btnMenu");
  const mobileMenu  = document.getElementById("mobileMenuPanel");
  const btnCart     = document.getElementById("btnCart");

  //  검색 수행 함수  trim()는 공백 제거
  function doSearch() {
    const keyword = searchInput.value.trim();

    // main.js에서 실행됨
    if (typeof window.searchByName === "function") {
      window.searchByName(keyword);
    }
  }

  // 엔터 누르면 검색 되도록
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doSearch();
    });
  }
  // 돋보기 클릭
  if (searchBtn) {
    searchBtn.addEventListener("click", doSearch);
  }

  // 모바일 메뉴 열고 닫기
  if (btnMenu) {
    btnMenu.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }

  // 장바구니 페이지로 이동
  if (btnCart) {
    btnCart.addEventListener("click", () => {
      window.location.href = "cart.html";
    });
  }
}





// 장바구니 개수 표시하기-------------------------------------
function updateCartCount() {
  // 로컬스토리지 가져오기
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountEl = document.getElementById("cartCount");

  // 총 수량 계산   reduce:배열을 하나의 값으로 바꿈    
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);


  
  if (totalQty === 0) {
    cartCountEl.style.display = "none"; 
  } else {
    cartCountEl.style.display = "flex";
    cartCountEl.textContent = totalQty;
  }
}


// 장바구니 추가하기 ----------------------------------------
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 동일한 제품 있는지 찾기
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;  
  } else {
    cart.push({ id: productId, qty: 1 });
  }
// 로컬스토리지에 다시 저장
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

//  전역 등록 
window.addToCart = addToCart;
