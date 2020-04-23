window.addEventListener("DOMContentLoaded", init);

function init() {

  /* レンダラー作成 */
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas")
  });
  const width = 1200
  const height = 540
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  /* シーン作成 */
  const scene = new THREE.Scene();
  // 地球
  const earth = createEarth();
  scene.add(earth);

  // new THREE.PerspectiveCamera(画角, アスペクト比, 描画開始距離, 描画終了距離)

  /* カメラ作成 */
  const camera = new THREE.PerspectiveCamera(
    60,
    width / height,
    1,
    1000
  );
  //camera.position.set(0,0,1000)

  /* メッシュ作成 */
  // new THREE.BoxGeometry(幅, 高さ, 奥行き)
  //const geometry = new THREE.BoxGeometry(300, 500, 200);
  // 色、質感
  // const material = new THREE.MeshStandardMaterial({
  //   color: 0x0000ff
  // });
  // new THREE.Mesh(ジオメトリ,マテリアル)
  //const box = new THREE.Mesh(geometry, material);
  // シーンにメッシュ追加
  //scene.add(box);

  /* ライト作成 */
  // new THREE.DirectionalLight(色)
  const light = new THREE.DirectionalLight(0xffffff);
  // ライトの位置を変更
  light.position.set(1, 1, 1);
  light.intensity = 2; // 光の強さを倍に
  // シーンにライト追加
  scene.add(light);

  let rot=0
  let mouseX=0

  // 初回実行
  //tick();
  requestAnimationFrame(tick);  //1回だけ動かす用

  function tick() {
    //requestAnimationFrame(tick);

    // 箱を回転させる
    // box.rotation.x += 0.1; //x軸の回転角 (ラジアン)
    // box.rotation.y += 0.1; //y軸の回転角 (ラジアン)
    // box.rotation.z += 0.1; //z軸の回転角 (ラジアン)

    //自動回転 度数
    //rot+=0.5

    // マウスの位置に応じて角度を設定
    // マウスのX座標がステージの幅の何%の位置にあるか調べてそれを360度で乗算する
    const targetRot = (mouseX / window.innerWidth) * 360;
    // イージングの公式を用いて滑らかにする
    // 値 += (目標値 - 現在の値) * 減速値
    rot += (targetRot - rot) * 0.02;
    
    // ラジアンに変換する
    const radian = rot * Math.PI / 180; 

    // 角度に応じてカメラの位置を設定
    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 1000 * Math.cos(radian);

    // 原点方向を見つめる
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // ライトも動かす（ライトの向きは？）
    light.position.x = 1000 * Math.sin(radian);
    light.position.z = 1000 * Math.cos(radian);

    console.log("camera.position" + camera.position);
    // レンダリング
    renderer.render(scene, camera);
  }

  /**
 * 地球を生成します
 * @returns {THREE.Mesh} 球
 */
function createEarth() {
  // 球
  const texture = (new THREE.TextureLoader).load('img/ground.jpg');
  return new THREE.Mesh(
    new THREE.SphereGeometry(100, 400, 400),
    new THREE.MeshBasicMaterial({map: texture}));
}


  function getOrbitPoints(startPos, endPos, segmentNum) {
    // 頂点を格納する配列
    const vertices = [];
    const startVec = startPos.clone();
    const endVec = endPos.clone();
  
    // 2つのベクトルの回転軸
    const axis = startVec.clone().cross(endVec);
    // 軸ベクトルを単位ベクトルに
    axis.normalize();
    // 2つのベクトルが織りなす角度
    const angle = startVec.angleTo(endVec);
  
    // 2つの点を結ぶ弧を描くための頂点を打つ
    for (let i = 0; i < segmentNum; i++) {
      // axisを軸としたクォータニオンを生成
      const q = new THREE.Quaternion();
      q.setFromAxisAngle(axis, (angle / segmentNum) * i);
      // ベクトルを回転させる
      const vertex = startVec.clone().applyQuaternion(q);
      vertices.push(vertex);
    }
  
    // 終了点を追加
    vertices.push(endVec);
    return vertices;
  }

  // マウス座標はマウスが動いた時のみ取得できる
  document.addEventListener("mousemove", (event) => {
    mouseX = event.pageX;
    tick();
  });
}