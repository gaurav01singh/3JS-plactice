import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";

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

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20, -40);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 500)
pointLight.castShadow = true

const boxgeo = new THREE.BoxGeometry(2, 2, 2);
const boxmet = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
  wireframe: false,
});
const box = new THREE.Mesh(boxgeo, boxmet);
scene.add(box);
box.castShadow = true;
box.receiveShadow = true


const sphereGeometry = new THREE.SphereGeometry(2,10,10);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.castShadow = true;
sphere.add(pointLight)
pointLight.position.set(0,1,0)


const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x000000,
  side: THREE.DoubleSide,
  wireframe: false,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
planeMesh.receiveShadow = true



const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0),
});

const groundPhysmat = new CANNON.Material()
const groundBody = new CANNON.Body({
  // shape: new CANNON.Plane(),
  // mass:10,
  shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.01)),
  type: CANNON.Body.STATIC,
  material:groundPhysmat,
});


const boxPhysmat = new CANNON.Material()
const boxBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  mass: 1,
  position: new CANNON.Vec3(5, 20, 0),
  material:boxPhysmat
});
// boxBody.angularVelocity.set(0,5,0)


const spherePhysMat = new CANNON.Material()
const sphereBody = new CANNON.Body({
  shape: new CANNON.Sphere(2),
  mass: 10 ,
  position: new CANNON.Vec3(0, 15, 0),
  material:spherePhysMat
});


const groundBoxcontactmat = new CANNON.ContactMaterial(
  groundPhysmat,
  boxPhysmat,
  {friction: 0}
)
const groundspherecontactmat = new CANNON.ContactMaterial(
  groundPhysmat,
  spherePhysMat,
  {restitution: 0.9}
)

world.addBody(boxBody);
world.addBody(sphereBody);
world.addBody(groundBody)
world.addContactMaterial(groundBoxcontactmat);
world.addContactMaterial(groundspherecontactmat);


sphereBody.linearDamping=0.31

groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
const timeStep = 1 / 60;



function animate() {
  world.step(timeStep);


  planeMesh.position.copy(groundBody.position);
  planeMesh.quaternion.copy(groundBody.quaternion);


  box.position.copy(boxBody.position);
  box.quaternion.copy(boxBody.quaternion);

  sphere.position.copy(sphereBody.position);
  sphere.quaternion.copy(sphereBody.quaternion);


  renderer.render(scene, camera);
}



renderer.setAnimationLoop(animate);



window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
