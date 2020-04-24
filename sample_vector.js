window.addEventListener("DOMContentLoaded", init);

function init() {
  // シーン
  const scene = new THREE.Scene();

  // レンダラー
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('#myCanvas'),
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio); 

  // カメラ
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  // camera.position.set(5), 0, 0);  //X軸カメラ
  // camera.position.set(0, 5, 0);  //Y軸カメラ
  camera.position.set(0, 0, 5);  //Z軸カメラ
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // 球
  // https://threejs.org/docs/#api/en/geometries/SphereGeometry
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1),
    new THREE.MeshBasicMaterial({color: 0xCC0000, wireframe: true}),
  );
  scene.add(sphere);


  const vec_Zero = new THREE.Vector3(0,0,0)
  // デフォルトは長さ1（単位ベクトル）なので、x,y,zの各値は -1 <= 0 <= 1 のfloat値になる。
  // (1,1,1) にした時、垂直なだけの線になるのが謎...
  // const vec_A = new THREE.Vector3(1,0,0)
  const vec_A = createVector(0,45)
  const vec_B = createVector(180,45)

  // 矢印ヘルパー
  // https://threejs.org/docs/#api/en/helpers/ArrowHelper
  // ArrowHelperの長さはNumber指定なので、float(小数)から実数に丸めているので正確ではない。今回の可視化の為。

  /// ベクトル加算  - 検証
  // const vec_C = vec_A.clone().add(vec_B)

  /// ベクトル減算  - 検証
  const vec_C = vec_B.clone().sub(vec_A)

  const helperA = new THREE.ArrowHelper(vec_A, vec_Zero, Math.floor(vec_A.length()), 0xffff00);  //黄色
  sphere.add(helperA);
  const helperB = new THREE.ArrowHelper(vec_B, vec_Zero, Math.floor(vec_B.length()), 0xeb2b50);  //赤色
  sphere.add(helperB);
  const helperC = new THREE.ArrowHelper(vec_C, vec_Zero, Math.floor(vec_C.length()), 0xcd08e5);  //紫色
  sphere.add(helperC);





  // 地面
  // https://threejs.org/docs/#api/en/helpers/GridHelper
  const plane = new THREE.GridHelper(100, 10);
  scene.add(plane);

  // レンダリング
  renderer.render(scene, camera);


}

/**
 * 
 * @param {number} longitude  方位角
 * @param {number} latitude   仰角
 */
function createVector(longitude, latitude) {
  // Vector3()に与える3点とは？
  // 型はfloat
  // 参考: https://ics.media/entry/10657/

  // 半径
  const radius = 1      // 参考：45度 √2/2 = 0.70710678118
  // 方位角 (longitude)     => 逆X軸から反時計回り。この時Z軸としてはプラスの方向。（手前がZ軸正）
  const theta = longitude * (Math.PI / 180)
  // 仰角 (latitude)        => X軸を0度して上方向が正
  const phi = latitude * (Math.PI / 180)
  // X座標
  const x = -radius * Math.cos(phi) * Math.cos(theta);
  console.log("x : " + x)

  // Y座標
  const y = radius * Math.sin(phi)
  console.log("y : " + y)

  // Z座標
  const z = radius * Math.cos(phi) * Math.sin(theta)
  console.log("z : " + z)

  return new THREE.Vector3(x,y,z)
}


// リサイズ時の処理
window.addEventListener('resize', () => {
  // カメラのアスペクト比を更新
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // レンダラーのサイズを更新
  renderer.setSize(window.innerWidth, window.innerHeight);
});

