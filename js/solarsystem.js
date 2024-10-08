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

  camera.position.set(-90, 140, 140);
  orbit.update();

  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);

  const cubeTextureLoader = new THREE.CubeTextureLoader();
  scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
  ]);

  const textureLoader = new THREE.TextureLoader();

  const sunGeo = new THREE.SphereGeometry(16, 30, 30);
  const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture),
  });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);

  function createPlanete(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(texture),
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if (ring) {
      const ringGeo = new THREE.RingGeometry(
        ring.innerRadius,
        ring.outerRadius,
        32
      );
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
    return { mesh, obj };
  }

  const mercury = createPlanete(3.2, mercuryTexture, 28);
  const venus = createPlanete(5.8, venusTexture, 44);
  const earth = createPlanete(6, earthTexture, 62);
  const mars = createPlanete(4, marsTexture, 78);
  const jupiter = createPlanete(12, jupiterTexture, 100);
  const saturn = createPlanete(10, saturnTexture, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture,
  });
  const uranus = createPlanete(7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture,
  });
  const neptune = createPlanete(7, neptuneTexture, 200);
  const pluto = createPlanete(2.8, plutoTexture, 216);

  const pointLight = new THREE.PointLight(0xffffff, 8000, 300);
  // pointLight.position.set( 30, 10, 0 );

  scene.add(pointLight);
  const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
scene.add( pointLightHelper )
  // const directionallight = new THREE.DirectionalLight(0xffffff, 5);
  // scene.add(directionallight);
  // directionallight.position.set(-30, 50, 0);
  // directionallight.castShadow = true;
  // directionallight.shadow.camera.bottom = -12;

  function animate() {
    // Self-rotation (in radians per frame, adjusted for relative speed)
    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.017);  // Mercury rotates slowly
    venus.mesh.rotateY(0.0015);  // Venus rotates very slowly and in reverse
    earth.mesh.rotateY(0.01);     // Earth rotates once per day
    mars.mesh.rotateY(0.01);      // Mars rotates at a similar speed to Earth
    jupiter.mesh.rotateY(0.05);   // Jupiter rotates quickly
    saturn.mesh.rotateY(0.04);    // Saturn also rotates quickly
    uranus.mesh.rotateY(0.03);    // Uranus has a moderate rotation speed
    neptune.mesh.rotateY(0.03);   // Neptune rotates relatively fast
    pluto.mesh.rotateY(0.008);    // Pluto has a slow rotation

    // Revolution around the sun (adjusted for actual orbital periods)
    mercury.obj.rotateY(0.024);   // Mercury orbits the sun quickly (88 days)
    venus.obj.rotateY(0.016);     // Venus has a slower orbit (225 days)
    earth.obj.rotateY(0.01);      // Earth orbits the sun in 365 days
    mars.obj.rotateY(0.008);      // Mars has a slower orbit (687 days)
    jupiter.obj.rotateY(0.002);   // Jupiter takes 12 years to orbit the sun
    saturn.obj.rotateY(0.0009);   // Saturn takes 29 years to orbit the sun
    uranus.obj.rotateY(0.0004);   // Uranus takes 84 years to orbit the sun
    neptune.obj.rotateY(0.0001);  // Neptune takes 165 years to orbit the sun
    pluto.obj.rotateY(0.00007);   // Pluto takes 248 years to orbit the sun
  
    renderer.render(scene, camera);
}

  renderer.setAnimationLoop(animate);

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
