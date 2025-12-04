document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const productId = parseInt(params.get("id"), 10);

  renderHeader(); // 공통 헤더 렌더링

  if (!productId) {
    document.getElementById("productName").innerText = "상품을 찾을 수 없습니다.";
    return;
  }

  loadProduct(productId);
});


/* ======================================
   상품 정보 로드
====================================== */
function loadProduct(productId) {
  fetch("data/products.json")
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === productId);

      if (!product) {
        document.getElementById("productName").innerText = "상품 정보를 찾을 수 없습니다.";
        return;
      }

      // DOM에 데이터 채우기
      document.getElementById("productName").textContent = product.name;
      document.getElementById("productDesc").textContent = product.desc;
      document.getElementById("productPrice").textContent =
        product.price.toLocaleString() + "원";
      document.getElementById("productImage").src = product.image;

      // 장바구니 버튼
      const addCartBtn = document.getElementById("addCartBtn");
      addCartBtn.addEventListener("click", () => {
        addToCart(product.id);
        alert("장바구니에 담겼습니다!");
      });

      // 3D 모델 있으면
      if (product.model) {
        loadModel(product.model);
      }
    });
}


/* ======================================
   Three.js 모델 로더
====================================== */
function loadModel(modelPath) {
  const canvas = document.getElementById("modelCanvas");
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(500, 500);
  renderer.setPixelRatio(window.devicePixelRatio);

  // 배경 흰색 + 불투명 (뒤가 투명하면 상대적으로 더 어둡게 느껴질 수 있음)
  renderer.setClearColor(0xffffff, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 1.2, 3);

  // 🔆 전체를 그냥 밝게 만들어주는 조명 2개만 사용
  // 위/아래 색 거의 비슷하게 해서 톤 차이를 줄임
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
  hemiLight.position.set(0, 2, 0);
  scene.add(hemiLight);

  // 전체 밝기 올리기용 주변광
  const ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);

  const loader = new THREE.GLTFLoader();
  loader.load(modelPath, (gltf) => {
    const model = gltf.scene;

    // 🔹 재질 앞/뒤 모두 보이게 + 너무 어둡지 않게
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.side = THREE.DoubleSide; // 앞/뒤 다 렌더링
        if (child.material.color) {
          // 혹시 색이 너무 어두우면 살짝 밝게(선택)
          child.material.color.offsetHSL(0, 0, 0.1);
        }
      }
    });

    model.scale.set(0.4, 0.4, 0.4);
    model.position.set(0, 0, 0);
    scene.add(model);

    function animate() {
      requestAnimationFrame(animate);
      model.rotation.y += 0.005;
      renderer.render(scene, camera);
    }

    animate();
  });
}



