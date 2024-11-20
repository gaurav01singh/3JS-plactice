import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";

// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);
const initialPosition = { x: 0, y: 2, z: 5 };
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#see"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);
scene.add(new THREE.PointLightHelper(pointLight));

// Grid Helper
const gridHelper = new THREE.GridHelper(50, 50);
scene.add(gridHelper);

// GUI setup
const gui = new dat.GUI();
const parameters = {
  cameraX: camera.position.x,
  cameraY: camera.position.y,
  cameraZ: camera.position.z,
  ambientIntensity: ambientLight.intensity,
  pointLightIntensity: pointLight.intensity,
  boxColor: 0x0077ff,
  sphereColor: 0xff0077,
  coneColor: 0x77ff00,
  torusColor: 0xff7700,
};

// Meshes with details
const meshes = [];
const meshDetails = [
  {
    geometry: new THREE.BoxGeometry(1, 1, 1),
    color: parameters.boxColor,
    position: [0, 0.5, 0],
    name: "Cube",
    details: "This is a cube.",
  },
  {
    geometry: new THREE.SphereGeometry(0.5, 32, 32),
    color: parameters.sphereColor,
    position: [-3, 0.5, 0],
    name: "Sphere",
    details: "This is a sphere.",
  },
  {
    geometry: new THREE.ConeGeometry(0.5, 1, 32),
    color: parameters.coneColor,
    position: [3, 0.5, 0],
    name: "Cone",
    details: "This is a cone.",
  },
  {
    geometry: new THREE.TorusGeometry(0.5, 0.2, 16, 100),
    color: parameters.torusColor,
    position: [0, 2.5, 0],
    name: "Torus",
    details: "This is a torus.",
  },
];

// Create meshes
function createMesh({ geometry, color, position, name, details }) {
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.userData = { name, details };
  scene.add(mesh);
  meshes.push(mesh);
}

meshDetails.forEach(createMesh);

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Display mesh details
function displayMeshDetails(mesh) {
  const meshDescriptionsContainer =
    document.getElementById("mesh-descriptions");

  if (meshDescriptionsContainer) {
    // First, fade out the current content
    gsap.to(meshDescriptionsContainer, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        // After fade-out, update the content
        meshDescriptionsContainer.innerHTML = `
                    <h2>${mesh.userData.name}</h2>
                    <p>${mesh.userData.details}</p>
                `;
        // Fade in the updated content
        gsap.to(meshDescriptionsContainer, { opacity: 1, duration: 0.5 });
      },
    });
  }
}

// Event listener for clicking on meshes
window.addEventListener("mousedown", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(meshes);

  if (intersects.length > 0) {
    const selectedMesh = intersects[0].object;
    const targetPosition = {
      x: selectedMesh.position.x,
      y: selectedMesh.position.y + 1,
      z: selectedMesh.position.z + 2,
    };

    // Animate camera to selected mesh and display details
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2.5,
      onUpdate: function () {
        camera.lookAt(selectedMesh.position);
      },
    });
    displayMeshDetails(selectedMesh);
  }
});

// Reset button event listener
document.getElementById('resetButton').addEventListener('click', function () {
    gsap.to(camera.position, {
        x: initialPosition.x,
        y: initialPosition.y,
        z: initialPosition.z,
        duration: 2.5,
        onUpdate: function () {
            camera.lookAt(0, 0, 0);
        }
    });
    document.getElementById('mesh-descriptions').style.opacity = 0; // Hide details
});

// Animation Loop
function animate() {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Resize Event
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
