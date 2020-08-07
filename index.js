window.addEventListener("DOMContentLoaded", init);

function init() {
  // シーン
  const scene = new THREE.Scene();

  // カメラ
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  // camera.position.set(0, 0, -400);
  camera.position.set(0, 0, 400);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  
  // レンダラー
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('#myCanvas'),
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio); 

  let degree = 0; // 角度
  const radius = 150; // 半径
  // let frontVector = new THREE.Vector3(0, 1, 0);

  // 球
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(10),
    new THREE.MeshBasicMaterial({color: 0xCC0000, wireframe: true}),
  );
  scene.add(sphere);

  // ヘルパー
  // const helper = new THREE.ArrowHelper(
  //   frontVector,
  //   new THREE.Vector3(100, 0, 0),
  //   40,
  // );
  // sphere.add(helper);

  // 地球
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(70, 20, 20),
    new THREE.MeshBasicMaterial({color: 0x666666, wireframe: true}),
  );
  scene.add(earth);

  // 地面
  const plane = new THREE.GridHelper(1000, 20);
  plane.position.y = -80;
  scene.add(plane);

  // フレーム毎のレンダーを登録
  // tick();

  /* ベクトルお試し start */
  // let frontVector2 = new THREE.Vector3(1, 0, 0);
  // const helper2 = new THREE.ArrowHelper(
  //   frontVector2,
  //   new THREE.Vector3(100, 0, 0),
  //   40,
  // );
  // helper2.setColor(new THREE.Color( 'skyblue' ))
  // sphere.add(helper2);

  /// ベクトル加算
  // console.log('frontVector: ', frontVector);
  // let frontVector3 = frontVector.clone().add(frontVector2)  //frontVectorは変更したくないのでclone()
  // console.log('frontVector: ', frontVector);
  // const helper3 = new THREE.ArrowHelper(
  //   frontVector3.normalize(),
  //   new THREE.Vector3(100, 0, 0),
  //   40,
  // );
  // helper3.setColor(new THREE.Color( 'red' ))
  // sphere.add(helper3);

  /// ベクトル減算
  const oldPosition = sphere.position.clone();
  console.log('oldPosition: ', oldPosition);
  const newPosition = getCircularMotionPosition(-2);
  console.log('newPosition: ', newPosition);
  frontVector = newPosition.clone().subVectors(newPosition, oldPosition);
  console.log('frontVector: ', frontVector);

  const helperOld = new THREE.ArrowHelper(
    oldPosition,
    new THREE.Vector3(100, 0, 0),
    40,
  );
  helperOld.setColor(new THREE.Color( 'orange' ))
  sphere.add(helperOld);
  
  const helperNew = new THREE.ArrowHelper(
    newPosition.normalize(),
    new THREE.Vector3(100, 0, 0),
    40,
  );
  helperNew.setColor(new THREE.Color( 'purple' ))
  sphere.add(helperNew);

  // const helperFront = new THREE.ArrowHelper(
  //   frontVector.normalize(),
  //   new THREE.Vector3(100, 0, 0),
  //   40,
  // );
  // helperFront.setColor(new THREE.Color( 'white' ))
  // sphere.add(helperFront);

  // let frontVector4 = frontVector.clone().sub(frontVector2)
  // let frontVector4 = frontVector.clone().subVectors(frontVector, frontVector2)
  // console.log('frontVector4: ', frontVector4);
  // console.log('frontVector4.normalize(): ', frontVector4.normalize());
  // const helper4 = new THREE.ArrowHelper(
  //   frontVector4.normalize(),
  //   new THREE.Vector3(100, 0, 0),
  //   40,
  // );
  // helper4.setColor(new THREE.Color( 'green' ))
  // sphere.add(helper4);

  /* ベクトルお試し end */

  // アニメーションなし事項
  renderer.render(scene, camera);

  function tick() {
    requestAnimationFrame(tick);
  
    // 球を回転させる
    degree -= 2;
  
    // 現在の位置を保持しておく
    const oldPosition = sphere.position.clone();
    // アニメーション後の新しい位置を取得
    const newPosition = getCircularMotionPosition(degree);
    // oldPostion - newPositionで進んでいる方向のベクトルを算出
    // frontVector = newPosition.clone().sub(oldPosition);
    frontVector = newPosition.clone().subVectors(newPosition, oldPosition);
    // 単位ベクトルに変換
    frontVector = frontVector.normalize();

    // 球の位置を更新
    sphere.position.copy(newPosition);

    // ヘルパーの向きを更新
    helper.setDirection(frontVector);

    // 背面ベクトル
    const backVector = frontVector.clone().negate();

    // 球とカメラの距離
    const distance = 200;
    // 背面ベクトルを距離分引き伸ばす
    backVector.multiplyScalar(distance);

    // カメラ位置を算出
    const cameraPosition = backVector.add(sphere.position);
    // 算出したカメラ位置を反映
    camera.position.copy(cameraPosition);

    // カメラを球に向かせる
    camera.lookAt(sphere.position);

    renderer.render(scene, camera);
  }

  /**
   * 角度を渡して円運動の位置を返却します
   * @param {Number} degree 角度です。
   * @returns {THREE.Vector3}
   */
  function getCircularMotionPosition(degree) {
    // 角度をラジアンに変換します
    const rad = degree * Math.PI / 180;
    // X座標 = 半径 x Cosθ
    const x = radius * Math.cos(rad);
    // Y座標
    const y = radius * Math.sin(rad * 1.5) / 7;
    // Z座標 = 半径 x Sinθ
    const z = radius * Math.sin(rad);

    return new THREE.Vector3(x, y, z);
  }


  // リサイズ時の処理
  window.addEventListener('resize', () => {
    // カメラのアスペクト比を更新
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // レンダラーのサイズを更新
    renderer.setSize(window.innerWidth, window.innerHeight);
  });


}