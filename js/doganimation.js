import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const dogUrl = new URL("../assests/doggo2.glb", import.meta.url);

const see = document.getElementById('see'); // Fixed getElementById

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: see });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
renderer.setClearColor(0xa3a3a3);
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
orbit.update();

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const assestLoader = new GLTFLoader();

let mixer;
assestLoader.load(
  dogUrl.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
    // const action = mixer.clipAction(clip);
    // action.play();

    clips.forEach(function (clip) {
      const action = mixer.clipAction(clip);
      action.play();
    });
  },
  undefined,
  function (error) {
    console.log(error);
  }
);

const clock = new THREE.Clock();

function animate() {
  if (mixer) mixer.update(clock.getDelta());
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
