    import * as THREE from 'three'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
    import * as dat from 'dat.gui'

    import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

    // import nebula from '../img/nebula.jpg';
    import T7 from '../img/T7.jpeg';
    import stars from '../img/stars.jpg';

    // const monkeyUrl = new URL('../assests/monkey.glb', import.meta.url);

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: see });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const textureLoader = new THREE.TextureLoader();
    // scene.background = textureLoader.load(nebula);
    const orbit = new OrbitControls(camera,renderer.domElement)

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    camera.position.set(-10, 30, 30);
    orbit.update();

    const boxgeo =new THREE.BoxGeometry()
    const boxmet = new THREE.MeshBasicMaterial({color:0x00FF00})
    const box = new THREE.Mesh(boxgeo,boxmet)
    scene.add(box)

    const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
    const box2Material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        map: textureLoader.load(T7)
    });
    const box2 = new THREE.Mesh(box2Geometry, box2Material);
    scene.add(box2);
    box2.position.set(0, 15, 10);


    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide,
        opacity:0
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    const gridhelp = new THREE.GridHelper(30)
    scene.add(gridhelp)

    const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x0000FF,
        wireframe: false});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.position.set(-10, 10, 0);
    sphere.castShadow = true;

    const sphere2Geometry = new THREE.SphereGeometry(4);
    // const vShader = `
    //     void main() {
    //         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //     }
    // `;

    // const fShader = `
    //     void main() {
    //         gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
    //     }
    // `;
    // const sphere2Material = new THREE.ShaderMaterial({
    //     vertexShader: document.getElementById('vertexShader').textContent,
    //     fragmentShader: document.getElementById('fragmentShader').textContent
    // });
    // const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
    // scene.add(sphere2);
    // sphere2.position.set(-5, 10, 10);


    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionallight = new THREE.DirectionalLight(0xFFFFFF,5)
    scene.add(directionallight)
    directionallight.position.set(-30,50,0)
    directionallight.castShadow =true;
    directionallight.shadow.camera.bottom =-12

    const dlighthelper = new THREE.DirectionalLightHelper(directionallight,5)
    scene.add(dlighthelper)

    const dlightshadowhelper = new THREE.CameraHelper(directionallight.shadow.camera)
    scene.add(dlightshadowhelper)

    const spotligth = new THREE.SpotLight(0xFFFFFF);
    scene.add(spotligth);
    spotligth.position.set(-100, 100, 0);
    spotligth.castShadow = true;
    spotligth.angle = 0.2;

    const slighthelper = new THREE.SpotLightHelper(spotligth);
    scene.add(slighthelper);

    scene.fog = new THREE.FogExp2(0xFFFFFF,0.01)

    const plane2Geometry = new THREE.PlaneGeometry(10,10,10,10);
    const plane2Material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        wireframe:true
    });
    const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
    scene.add(plane2);
    plane2.position.set(10,10,15)

    plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
    plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
    plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
    const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
    plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

    // const assetLoader = new GLTFLoader();


    // assetLoader.load(monkeyUrl.href, function(gltf) {
    //     const model = gltf.scene;
    //     scene.add(model);
    //     model.position.set(-12, 4, 10);
        


    // }, undefined, function(error) {
    //     console.error(error);
    // });


    const gui = new dat.GUI()

    const options = {
        sphereColor:'#ffee00',
        planColor:'#FFFFFF',
        Wireframe:false,
        speed:0.01,
        angle:0.2,
        penumbra:0,
        intensity:1
    }
    gui.addColor(options,"sphereColor").onChange(function(e){
        sphere.material.color.set(e)
    })
    gui.addColor(options,"planColor").onChange(function(e){
        plane.material.color.set(e)
    })
    gui.add(options,"Wireframe").onChange(function(e){
        sphere.material.wireframe=e;
    })
    gui.add(options,'speed',0,0.1)
    gui.add(options,'angle',0,1)
    gui.add(options,'penumbra',0,1)
    gui.add(options,'intensity',0,1)
    let step =0;

    const mousePosition = new THREE.Vector2()
    window.addEventListener('mousemove', function(e) {
        mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
    });
    const rayCaster = new THREE.Raycaster();

    const sphereId = sphere.id;
    box2.name = 'theBox';
    const clock = new THREE.Clock();

    function animation(time){
        box.rotation.x =time/1000;
        box.rotation.y =time/1000;
        
        step += options.speed;
        sphere.position.y = 4+10*Math.abs(Math.sin(step))
        spotligth.angle=options.angle
        spotligth.penumbra=options.penumbra
        spotligth.intensity=options.intensity
        slighthelper.update()

        rayCaster.setFromCamera(mousePosition, camera);
        const intersects = rayCaster.intersectObjects(scene.children);
        // console.log(intersects);
        for(let i = 0; i < intersects.length; i++) {
            if(intersects[i].object.id === sphereId)
                intersects[i].object.material.color.set(0xFF0000);

            if(intersects[i].object.name === 'theBox') {
                intersects[i].object.rotation.x = time / 1000;
                intersects[i].object.rotation.y = time / 1000;
            }
        }
        plane2.geometry.attributes.position.array[0] = Math.sin( Math.random());
        plane2.geometry.attributes.position.array[1] = Math.sin( Math.random());
        plane2.geometry.attributes.position.array[2] = Math.sin( Math.random());
        plane2.geometry.attributes.position.array[lastPointZ] = Math.sin( Math.random());
        plane2.geometry.attributes.position.needsUpdate = true;
        renderer.render(scene,camera)
    }


    const cubeTextureLoader = new THREE.CubeTextureLoader();
    scene.background = cubeTextureLoader.load([
        stars,
        stars,
        stars,
        stars,
        stars,
        stars
    ]);


    renderer.setAnimationLoop(animation)

    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });