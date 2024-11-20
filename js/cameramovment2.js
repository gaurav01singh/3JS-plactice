import * as THREE from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

const see = document.getElementById("see");

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: see });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.setClearColor(0xa3a3a3);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(-1.7, 0, 8.7);
camera.lookAt(1.7, 0, 8.7);

const locations = [
  { heading: "Location 1", text: "This is the first location's description." },
  { heading: "Location 2", text: "This is the second location's description." },
  { heading: "Location 3", text: "Description for the third location." },
  { heading: "Location 4", text: "Information about the fourth location." },
  { heading: "Location 5", text: "Description for the fifth location." },
  { heading: "Location 6", text: "Final location's description." }
];

const locationHeading = document.getElementById("location-heading");
const locationText = document.getElementById("location-text");

// const controls = new FirstPersonControls(camera, renderer.domElement);
// controls.movementSpeed = 8;
// controls.lookSpeed = 0.008;

const gltfLoader = new GLTFLoader();
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

gltfLoader.load("../assests/the_king_s_hall/scene.gltf", function (gltf) {
  const model = gltf.scene;
  scene.add(model);
  let position=0;

  function updateLocationInfo(pos) {
    locationHeading.textContent = locations[pos].heading;
    locationText.textContent = locations[pos].text;
  }

  updateLocationInfo(position);

  window.addEventListener("mouseup", () => {
    switch (position) {
      case 0:
        moveCamera(-1.8, 1.6, 5);
        rotateCamera(0, 0.1, 0);
        position = 1;
        break;
      case 1:
        moveCamera(2.8, 0, 3.6);
        rotateCamera(0, -2, 0);
        position = 2;
        break;
      case 2:
        moveCamera(2.5, -0.9, 12.2);
        rotateCamera(0.9, 0.6, -0.6);
        position = 3;
        break;
      case 3:
        moveCamera(-2.7, 0.6, 3.7);
        rotateCamera(0.6, 1.9, -0.6);
        position = 4;
        break;
      case 4:
        moveCamera(-1.7, 0, 8.7);
        rotateCamera(0, 4.7, 0);
        position = 5;
        break;
      case 5:
        moveCamera(0.5, 0.8, 10);
        rotateCamera(0.3, 1.65, -0.3);
        position = 0;
    }
    updateLocationInfo(position)
  });
  function moveCamera(x, y, z) {
    gsap.to(camera.position, {
      x,
      y,
      z,
      duration: 3,
    });
  }

  function rotateCamera(x, y, z) {
    gsap.to(camera.rotation, {
      x,
      y,
      z,
      duration: 3.2,
    });
  }
});

// Add a basic light

const clock = new THREE.Clock();
function animate() {
  // controls.update(clock.getDelta());
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
