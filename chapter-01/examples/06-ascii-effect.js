import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js'; 

function init(){
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);


    const renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xEEEEEE);
    renderer.shadowMap.enabled = true;
    

    // document.body.appendChild(renderer.domElement);

    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    const planeGeometry = new THREE.PlaneGeometry(40, 20, 32, 32);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 8;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
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
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);

    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 5) ;
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    directionalLight.shadow.mapSize.width = window.innerWidth;
    directionalLight.shadow.mapSize.height = window.innerHeight;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 200;

    const DirectionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(DirectionalLightHelper);

    const effect = new AsciiEffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(effect.domElement);

    const controls = new TrackballControls(camera, effect.domElement);
    controls.rotateSpeed = 0.2;
    controls.dynamicDampingFactor = 0.15;

    window.addEventListener('resize', function () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        effect.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    let step = 0;
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);    

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    const gui = new dat.GUI();
    gui.add(controls, 'rotateSpeed', 0, 4);
    gui.add(controls, 'dynamicDampingFactor', 0, 0.15);


    function render(){
        stats.update();
        step += controls.rotateSpeed;

        sphere.position.x = 20 + (10 * Math.cos(step));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        cube.rotation.x += controls.rotateSpeed;
        cube.rotation.y += controls.rotateSpeed;
        cube.rotation.z += controls.rotateSpeed;
        
        requestAnimationFrame(render);
        controls.update();
        effect.render(scene, camera);
    }
    render();

}

window.onload = init;
