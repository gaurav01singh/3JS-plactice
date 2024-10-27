import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from 'gsap';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

// Store initial camera position
const initialPosition = { x: 0, y: 2, z: 5 };

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#see') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);
scene.add(new THREE.PointLightHelper(pointLight));

// Orbit Controls (optional)
// const orbit = new OrbitControls(camera, renderer.domElement);
// orbit.enableDamping = true;

// Grid Helper
const gridHelper = new THREE.GridHelper(50, 50);
scene.add(gridHelper);

const meshes = [];
const colors = [0x0077ff, 0xff0077, 0x77ff00, 0xff7700];  // Colors for each mesh

function createMesh(geometry, color, position) {
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    scene.add(mesh);
    meshes.push(mesh);
}

createMesh(new THREE.BoxGeometry(1, 1, 1), colors[0], [0, 0.5, 0]);
createMesh(new THREE.SphereGeometry(0.5, 32, 32), colors[1], [-3, 0.5, 0]);
createMesh(new THREE.ConeGeometry(0.5, 1, 32), colors[2], [3, 0.5, 0]);
createMesh(new THREE.TorusGeometry(0.5, 0.2, 16, 100), colors[3], [0,2.5, 0]);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
        const selectedMesh = intersects[0].object;

        const targetPosition = {
            x: selectedMesh.position.x,
            y: selectedMesh.position.y + 1,
            z: selectedMesh.position.z + 2
        };

        gsap.to(camera.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2.5,  
            onUpdate: function () {
                camera.lookAt(selectedMesh.position);
            }
        });
    }
});

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
});

// Animation Loop
function animate() {
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Resize Event
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
