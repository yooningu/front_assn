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
      document.getElementById("productPrice").textContent = product.price.toLocaleString() + "원";
      document.getElementById("productImage").src = product.image;
      document.getElementById("productImage").src = product.image;



       document.getElementById("ad1").src = product.ad1;
       document.getElementById("ad2").src = product.ad2;
       document.getElementById("ad3").src = product.ad3;
       document.getElementById("adm1").src = product.adm1;
       document.getElementById("adm2").src = product.adm2;   


      // 장바구니 버튼
      const addCartBtn = document.getElementById("addCartBtn");
      addCartBtn.addEventListener("click", () => {
        addToCart(product.id);
        alert("장바구니에 담겼습니다");
      });
        loadModel(product.model);
    });
}














/* ======================================
   Three.js 모델 로더
====================================== */
/* ======================================
   Three.js 모델 로더 (반응형 버전)
====================================== */
function loadModel(modelPath) {
  const canvas = document.getElementById("modelCanvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);

  // 배경 흰색 + 불투명
  renderer.setClearColor(0xffffff, 1);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 1.2, 3);

  // 조명
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
  hemiLight.position.set(0, 2, 0);
  scene.add(hemiLight);

  const ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);

  const loader = new THREE.GLTFLoader();
  loader.load(modelPath, (gltf) => {
    const model = gltf.scene;

    // 재질 보정
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.side = THREE.DoubleSide;
        if (child.material.color) {
          child.material.color.offsetHSL(0, 0, 0.1);
        }
      }
    });

    model.scale.set(0.4, 0.4, 0.4);
    model.position.set(0, 0, 0);
    scene.add(model);

   
    function resizeRenderer() {
      const width = canvas.clientWidth;  // 가로 100%
      const height = width * 1;          // 높이 = 가로 × 1(정사각형 비율)
      renderer.setSize(width, height, false);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    resizeRenderer();
    window.addEventListener("resize", resizeRenderer);

    function animate() {
      requestAnimationFrame(animate);
      model.rotation.y += 0.02;
      renderer.render(scene, camera);
    }

    animate();
  });
}





