import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";

const see = document.getElementById("see"); // Fixed getElementById

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

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(10, 10, 0);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 50, 0);
scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
const dlighthelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dlighthelper);

// Physics world setup
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0),
});

// Ground setup for physics
const groundPhysmat = new CANNON.Material();
const groundBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.01)),
  type: CANNON.Body.STATIC,
  material: groundPhysmat,
});
world.addBody(groundBody);

// Contact material for bounce between ground and spheres
const spherePhysMat = new CANNON.Material();
const groundSphereContactMat = new CANNON.ContactMaterial(
  groundPhysmat,
  spherePhysMat,
  { restitution: 0.9 }
);
world.addContactMaterial(groundSphereContactMat);

// Visual ground
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -0.5 * Math.PI;
scene.add(planeMesh);
planeMesh.receiveShadow = true;

// Axes helper
const helper = new THREE.AxesHelper(20);
scene.add(helper);

// Mouse and raycasting setup
const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

window.addEventListener("mousemove", function (e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectionPoint);
});

const maxSpheres = 50; // Limit the number of spheres to prevent exponential slowdowns
const spheres = [];
const sphereBodies = [];

// Helper function to remove old spheres
function removeOldSphere() {
  if (spheres.length >= maxSpheres) {
    const oldSphereMesh = spheres.shift(); // Remove oldest sphere mesh
    const oldSphereBody = sphereBodies.shift(); // Remove oldest sphere body
    scene.remove(oldSphereMesh); // Remove from scene
    world.removeBody(oldSphereBody); // Remove from physics world
  }
}

window.addEventListener("click", function () {
  removeOldSphere(); // Ensure the number of spheres doesn't exceed the limit

  // Create Three.js visual sphere
  const sphereGeometry = new THREE.SphereGeometry(0.125, 30, 30);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: Math.random(5) * 0xFF00FF,
    metalness: 0,
    roughness: 0
  });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphereMesh);
  sphereMesh.castShadow = true;
  // const pointLight = new THREE.PointLight(0x872727,100,100,3)
  // sphereMesh.add(pointLight)

  // Create Cannon.js sphere body
  const sphereBody = new CANNON.Body({
    shape: new CANNON.Sphere(0.125), // Match the radius of Three.js sphere
    mass: 1,
    position: new CANNON.Vec3(
      intersectionPoint.x,
      intersectionPoint.y,
      intersectionPoint.z
    ),
    material: spherePhysMat,
  });
  world.addBody(sphereBody);

  // Damping to simulate air resistance
  sphereBody.linearDamping = 0.1;

  // Store references to manage spheres later
  spheres.push(sphereMesh);
  sphereBodies.push(sphereBody);

  // Add physics and mesh synchronization
  function updatePhysics() {
    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);
  }

  // Push update function into the animation loop
  updateFunctions.push(updatePhysics);
});

// Synchronize ground's physics and visual mesh
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
const timeStep = 1 / 60;

// Store update functions to sync physics and visuals
const updateFunctions = [];

function animate() {
  world.step(timeStep);

  // Update ground mesh position and rotation
  planeMesh.position.copy(groundBody.position);
  planeMesh.quaternion.copy(groundBody.quaternion);

  // Call all the update functions for sphere synchronization
  updateFunctions.forEach((fn) => fn());

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
