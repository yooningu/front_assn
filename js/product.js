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












function loadModel(modelPath) {
  const canvas = document.getElementById("modelCanvas");

  // 캔버스의 실제 픽셀 크기(PC/모바일 공통)
  const width  = canvas.clientWidth;
  const height = canvas.clientHeight;

  // 렌더러
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height, false);
  renderer.setClearColor(0xffffff, 1); // 흰 배경

  // 씬 + 카메라
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 3000);
  camera.position.set(0, 0, 5);

  // 조명
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
  hemiLight.position.set(0, 2, 0);
  scene.add(hemiLight);

  const ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);

  const loader = new THREE.GLTFLoader();
  loader.load(
    modelPath,
    (gltf) => {
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

      // 기본 스케일
      model.scale.set(0.4, 0.4, 0.4);
      scene.add(model);

      // -------------------------
      // 1) 박스로 크기/중심 계산
      // -------------------------
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // 중심을 (0,0,0)에 맞추기
      model.position.x -= center.x;
      model.position.y -= center.y;
      model.position.z -= center.z;

      // 세로 길이를 기준으로 카메라 거리 계산
      const fov = camera.fov * (Math.PI / 180); // 라디안
      const fullHeight = size.y;
      let distance = (fullHeight / 2) / Math.tan(fov / 2);

      // 여유 공간 넉넉하게 (짤리면 이 숫자를 더 키우면 됨)
      distance *= 2.0;

      camera.position.set(0, 0, distance);
      camera.lookAt(0, 0, 0);

      // -------------------------
      // 2) 애니메이션
      // -------------------------
      function animate() {
        requestAnimationFrame(animate);
        model.rotation.y += 0.02;
        renderer.render(scene, camera);
      }

      animate();
    },
    undefined,
    (err) => {
      console.error("모델 로드 실패:", err);
    }
  );
}






