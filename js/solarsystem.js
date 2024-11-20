import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import starsTexture from "../img/stars.jpg";
import sunTexture from "../img/sun.jpg";
import mercuryTexture from "../img/mercury.jpg";
import venusTexture from "../img/venus.jpg";
import earthTexture from "../img/earth.jpg";
import marsTexture from "../img/mars.jpg";
import jupiterTexture from "../img/jupiter.jpg";
import saturnTexture from "../img/saturn.jpg";
import saturnRingTexture from "../img/saturn ring.png";
import uranusTexture from "../img/uranus.jpg";
import uranusRingTexture from "../img/uranus ring.png";
import neptuneTexture from "../img/neptune.jpg";
import plutoTexture from "../img/pluto.jpg";

const see = document.getElementById('see');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: see });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([starsTexture, starsTexture, starsTexture, starsTexture, starsTexture, starsTexture]);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({ map: textureLoader.load(sunTexture) });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const planetsInfo = {
    mercury: { name: "Mercury", description: "Mercury is the closest planet to the Sun." },
    venus: { name: "Venus", description: "Venus is known as Earth's sister planet." },
    earth: { name: "Earth", description: "Earth is the only known planet to support life." },
    mars: { name: "Mars", description: "Mars is known as the Red Planet." },
    jupiter: { name: "Jupiter", description: "Jupiter is the largest planet in our solar system." },
    saturn: { name: "Saturn", description: "Saturn is known for its stunning rings." },
    uranus: { name: "Uranus", description: "Uranus rotates on its side." },
    neptune: { name: "Neptune", description: "Neptune is a gas giant and the farthest planet from the Sun." },
    pluto: { name: "Pluto", description: "Pluto was once classified as the ninth planet." }
};

let selectedPlanet = null;

// Create planets and store references with their name
function createPlanet(size, texture, position, ring, name) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({ map: textureLoader.load(texture) });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);

  if (ring) {
      const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
      const ringMat = new THREE.MeshBasicMaterial({
          map: textureLoader.load(ring.texture),
          side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      obj.add(ringMesh);
      ringMesh.position.x = position;
      ringMesh.rotation.x = -0.5 * Math.PI;
  }

  scene.add(obj);
  mesh.position.x = position;

  // Add the planet name to the object for easier matching
  return { name, mesh, obj };
}

const mercury = createPlanet(3.2, mercuryTexture, 28, null, "Mercury");
const venus = createPlanet(5.8, venusTexture, 44, null, "Venus");
const earth = createPlanet(6, earthTexture, 62, null, "Earth");
const mars = createPlanet(4, marsTexture, 78, null, "Mars");
const jupiter = createPlanet(12, jupiterTexture, 100, null, "Jupiter");
const saturn = createPlanet(10, saturnTexture, 138, { innerRadius: 10, outerRadius: 20, texture: saturnRingTexture }, "Saturn");
const uranus = createPlanet(7, uranusTexture, 176, { innerRadius: 7, outerRadius: 12, texture: uranusRingTexture }, "Uranus");
const neptune = createPlanet(7, neptuneTexture, 200, null, "Neptune");
const pluto = createPlanet(2.8, plutoTexture, 216, null, "Pluto");



const pointLight = new THREE.PointLight(0xffffff, 8000, 300);
scene.add(pointLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointLightHelper);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const meshes = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto];

const planetButtonsContainer = document.getElementById('planetButtonsContainer');
const descriptionContainer = document.getElementById('planetDescription');

// Create buttons for each planet
const planetData = [
    { name: 'Mercury', texture: mercuryTexture, size: 3.2 },
    { name: 'Venus', texture: venusTexture, size: 5.8 },
    { name: 'Earth', texture: earthTexture, size: 6 },
    { name: 'Mars', texture: marsTexture, size: 4 },
    { name: 'Jupiter', texture: jupiterTexture, size: 12 },
    { name: 'Saturn', texture: saturnTexture, size: 10 },
    { name: 'Uranus', texture: uranusTexture, size: 7 },
    { name: 'Neptune', texture: neptuneTexture, size: 7 },
    { name: 'Pluto', texture: plutoTexture, size: 2.8 }
];

planetData.forEach(planet => {
    const button = document.createElement('button');
    button.innerText = planet.name;
    button.style.padding = "10px 20px";
    button.style.margin = "5px";
    button.addEventListener('click', function(){ 
      // console.log("hell")
      zoomIntoPlanet(planet.name)});
    planetButtonsContainer.appendChild(button);
});

function zoomIntoPlanet(planetName) {
  // Find the planet based on the name
  const selectedPlanet = meshes.find(item => item.name === planetName);

  if (selectedPlanet) {
      console.log("Planet selected:", planetName);

      const targetPosition = {
          x: selectedPlanet.mesh.position.x,
          y: selectedPlanet.mesh.position.y + 10,
          z: selectedPlanet.mesh.position.z + 20
      };

      // GSAP animation to move the camera
      gsap.to(camera.position, {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z,
          duration: 2.5,
          onUpdate: function () {
              camera.lookAt(selectedPlanet.mesh.position);
          }
      });

      // Show planet description
      showPlanetDescription(selectedPlanet);
  }
}


function showPlanetDescription(planet) {
    descriptionContainer.innerHTML = `
        <h2>${planet.name}</h2>
        <p>${planetsInfo[planet.name.toLowerCase()].description}</p>
    `;
    descriptionContainer.style.opacity = 1;
}

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
    gsap.to(camera.position, {
        x: -90,
        y: 140,
        z: 140,
        duration: 2.5,
        onUpdate: function () {
            camera.lookAt(0, 0, 0);
        }
    });

    descriptionContainer.style.opacity = 0;
});

function animate() {
    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.017);
    venus.mesh.rotateY(0.0015);
    earth.mesh.rotateY(0.01);
    mars.mesh.rotateY(0.01);
    jupiter.mesh.rotateY(0.05);
    saturn.mesh.rotateY(0.04);
    uranus.mesh.rotateY(0.03);
    neptune.mesh.rotateY(0.03);
    pluto.mesh.rotateY(0.008);

    mercury.obj.rotateY(0.024);
    venus.obj.rotateY(0.016);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);
    pluto.obj.rotateY(0.00007);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
