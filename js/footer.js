function renderFooter() {
  const footerHTML = `
    <footer class="site-footer">
      © 2025 SAMJUNG. All Rights Reserved.
    </footer>
  `;
  document.body.insertAdjacentHTML("beforeend", footerHTML);
}

// 페이지 로드 시 자동 실행되게 등록
document.addEventListener("DOMContentLoaded", renderFooter);
