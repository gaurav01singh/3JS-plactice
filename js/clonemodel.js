import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

const modelUrl = new URL("../assests/Stag.gltf", import.meta.url);
const see = document.getElementById("see"); // Fixed getElementById

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: see });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight, // Corrected "innerHighght" to "innerHeight"
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(10, 6, 10);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(0, 30, 0);
scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
const dlighthelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dlighthelper);

const assetLoader = new GLTFLoader();

// let mixer;
let stag;
let clips;
assetLoader.load(
  modelUrl.href,
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    // scene.add(model);
    stag = model;
    clips = gltf.animations;
  },
  undefined,
  function (error) {
    console.log(error);
  }
);
const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    visible: true,
  })
);
planeMesh.rotateX(-Math.PI / 2);
scene.add(planeMesh);
planeMesh.position.set(0, -0.01, 0);
planeMesh.name = "ground";

const GridHelper = new THREE.GridHelper(20, 20);
scene.add(GridHelper);

const highlightMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
  })
);
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.position.set(0.5, 0, 0.5);
scene.add(highlightMesh);

const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1; // Corrected "innerHighght" to "innerHeight"
  raycaster.setFromCamera(mousePosition, camera);
  intersects = raycaster.intersectObjects(scene.children);
  intersects.forEach(function (inter) {
    if (inter.object.name === "ground") {
      const highlightpos = new THREE.Vector3()
        .copy(inter.point)
        .floor()
        .addScalar(0.5);
      highlightMesh.position.set(highlightpos.x, 0, highlightpos.z);
    }
    const objectExist = objects.find(function (object) {
      return (
        object.position.x === highlightMesh.position.x &&
        object.position.z === highlightMesh.position.z
      );
    });

    if (!objectExist) highlightMesh.material.color.setHex(0x00ff00);
    else highlightMesh.material.color.setHex(0xff0000);
  });
});

// const sphereMesh = new THREE.Mesh(
//   new THREE.SphereGeometry(0.4, 4, 2),
//   new THREE.MeshBasicMaterial({
//     wireframe: true,
//     color: 0xffea00,
//   })
// );
//  const pointLight = new THREE.PointLight(0x872727,100,100,3)

const objects = [];
const mixers = [];

window.addEventListener("mousedown", function () {
  const objectExist = objects.find(function (object) {
    return (
      object.position.x === highlightMesh.position.x &&
      object.position.z === highlightMesh.position.z
    );
  });
  if (!objectExist) {
    intersects.forEach(function (inter) {
      if (inter.object.name === "ground") {
        const stagClone = SkeletonUtils.clone(stag);
        stagClone.position.copy(highlightMesh.position);
        // const pointLightclon = pointLight.clone()
        // stagClone.add(pointLightclon)
        scene.add(stagClone);
        objects.push(stagClone);
        highlightMesh.material.color.setHex(0xff0000);
        const mixer = new THREE.AnimationMixer(stagClone);

        const clip = THREE.AnimationClip.findByName(clips, "Idle_2");
        const action = mixer.clipAction(clip);
        action.play();
        mixers.push(mixer)
      }
    });
  }
  console.log(scene.children.length);
});
const clock = new THREE.Clock();

function animate(time) {
  //   if (mixer) mixer.update(clock.getDelta());
  const delta = clock.getDelta()
  mixers.forEach(function(mixer){
    mixer.update(delta); 
  })
  highlightMesh.material.opacity = 1 + Math.sin(time / 300);
  //   objects.forEach(function(object) {
  //     object.rotation.x = time / 1000;
  //     object.rotation.z = time / 1000;
  //     object.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
  // });
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
