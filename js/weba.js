import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";




const scene = new THREE.Scene()


const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.setZ(30)



const ambientLight = new THREE.AmbientLight(0xffffff,0.1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff,400);
pointLight.position.set(10,10,10)
scene.add(pointLight)
const lighthelper = new THREE.PointLightHelper(pointLight)
scene.add(lighthelper)


const renderer = new THREE.WebGLRenderer({ canvas:document.querySelector('#see')});

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth,window.innerHeight)


const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(25, 25, 0);
orbit.update();


const torus = new THREE.Mesh(
    new THREE.TorusGeometry(10,3,16,100),
    new THREE.MeshStandardMaterial({color:0xff6347})
)
scene.add(torus)

function animate(){
    requestAnimationFrame(animate)
    torus.rotation.x += 0.009; 
    torus.rotation.y += 0.0001; 
    torus.rotation.z += 0.09; 
    renderer.render(scene,camera)
}
animate()
