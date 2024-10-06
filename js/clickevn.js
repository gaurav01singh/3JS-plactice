import * as Three from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const renderer = new Three.WebGL3DRender();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  
  const orbit = new OrbitControls(camera, renderer.domElement);
  
  camera.position.set(0, 20, -40);
  orbit.update();