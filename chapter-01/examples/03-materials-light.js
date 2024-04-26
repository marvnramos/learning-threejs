import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js'; 

function init(){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Habilitar el renderizado de sombras
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Tipo de sombras suaves

    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    const planeGeometry = new THREE.PlaneGeometry(60, 20, 32, 32);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true; // Permitir que el plano reciba sombras
    scene.add(plane);

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    cube.castShadow = true;
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x7777ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.receiveShadow = false; //default
    sphere.castShadow = true;
    scene.add(sphere);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // Agregar luz ambiental
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Color de la luz ambiental
    scene.add(ambientLight);

    const light = new THREE.SpotLight( 0xffffff );
    light.castShadow = true; // default false
    scene.add( light );
    
    //Set up shadow properties for the light
    light.shadow.mapSize.width = 300; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    light.shadow.focus = 1; // default

    const helper = new THREE.CameraHelper( light.shadow.camera );
scene.add( helper );

    document.body.appendChild(renderer.domElement);

    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 4;
    controls.dynamicDampingFactor = 0.15;

    function render(){
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
    }
    render();

}

window.onload = init;
