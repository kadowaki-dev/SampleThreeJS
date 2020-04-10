window.addEventListener("DOMContentLoaded", init);

function init() {

  /* レンダラー作成 */
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas")
  });
  const width = 960
  const height = 540
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  /* シーン作成 */
  const scene = new THREE.Scene();
  // new THREE.PerspectiveCamera(画角, アスペクト比, 描画開始距離, 描画終了距離)

  /* カメラ作成 */
  const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    1,
    10000
  );
  camera.position.set(0,0,1000)

  /* メッシュ作成 */
  // new THREE.BoxGeometry(幅, 高さ, 奥行き)
  const geometry = new THREE.BoxGeometry(300, 500, 200);
  // 色、質感
  const material = new THREE.MeshStandardMaterial({
    color: 0x0000ff
  });
  // new THREE.Mesh(ジオメトリ,マテリアル)
  const box = new THREE.Mesh(geometry, material);
  // シーンにメッシュ追加
  scene.add(box);

  /* ライト作成 */
  // new THREE.DirectionalLight(色)
  const light = new THREE.DirectionalLight(0xffffff);
  // ライトの位置を変更
  light.position.set(1, 1, 1);
  light.intensity = 2; // 光の強さを倍に
  // シーンにライト追加
  scene.add(light);

  //レンダリング
  renderer.render(scene, camera);

}