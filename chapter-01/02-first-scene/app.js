import * as THREE from './node_modules/three/build/three.module.js';
import { TrackballControls } from './node_modules/three/examples/jsm/controls/TrackballControls.js';

// creating scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setClearColor(0xEEEEEE);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


// creating axes helper
const axes = new THREE.AxesHelper(20);
scene.add(axes);

// creating plane ground
const planeGeometry = new THREE.PlaneGeometry(60, 20);
// const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 15;
plane.position.y = 0;
plane.position.z = 0;

scene.add(plane);

const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
// const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000});
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.position.x = -4;
cube.position.y = 3;
cube.position.z = 0;

scene.add(cube);


const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
// const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff });
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

sphere.position.x = 20;
sphere.position.y = 4;
sphere.position.z = 2;

scene.add(sphere);

camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);

// adding spotlights
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
scene.add(spotLight);

const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 4;
controls.dynamicDampingFactor = 0.15;




const render = function () {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}
render();