import * as THREE from './node_modules/three/build/three.module.js';
import { TrackballControls } from './node_modules/three/examples/jsm/controls/TrackballControls.js';

// Creando la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setClearColor(0xEEEEEE);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Creando el helper de ejes
const axes = new THREE.AxesHelper(20);
scene.add(axes);

// Creando el plano
const planeGeometry = new THREE.PlaneGeometry(60, 20);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 15;
plane.position.y = 0;
plane.position.z = 0;

scene.add(plane);

// Cubo
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.position.x = -4;
cube.position.y = 3;
cube.position.z = 0;

scene.add(cube);

// Esfera
const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

sphere.position.set(20, 4, 2);
scene.add(sphere);

camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);


// Creando la luz direccional
// Agregar una luz direccional para simular la luz del sol
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 50, 50);
directionalLight.castShadow = true; // Permitir que la luz emita sombras
scene.add(directionalLight);

// Configurar propiedades de sombra para la luz direccional
directionalLight.shadow.mapSize.width = window.innerWidth; // Resolución del mapa de sombras
directionalLight.shadow.mapSize.height = window.innerHeight;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.near = 0.5; // Distancia cercana de la cámara de sombras
directionalLight.shadow.camera.far = 200; // Distancia lejana de la cámara de sombras

// Agregar una luz puntual para iluminar áreas específicas
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(0, 20, 0);
pointLight.castShadow = true;
scene.add(pointLight);

// Configurar propiedades de sombra para la luz puntual
pointLight.shadow.mapSize.width = window.innerWidth; // Resolución del mapa de sombras
pointLight.shadow.mapSize.height = window.innerHeight;
pointLight.shadow.camera.near = 0.5; // Distancia cercana de la cámara de sombras
pointLight.shadow.camera.far = 100; // Distancia lejana de la cámara de sombras



const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 4;
controls.dynamicDampingFactor = 0.15;

window.addEventListener('resize', function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});


const render = function () {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}
render();
