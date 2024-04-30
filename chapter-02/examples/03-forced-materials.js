import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import * as dat from 'dat.gui';
import Stats from 'stats.js';

const init = () => {
    const scene = new THREE.Scene();
    scene.overrideMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer(/*{ antialias: true}*/);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.shadowMap.enabled = true;

    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    const ambientLight = new THREE.AmbientLight(0x0c0c0c,0.1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-40, 60, -10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    scene.add(directionalLightHelper);

    document.body.appendChild(renderer.domElement);

    let steps = 0;
    
    const controls = new function(){
        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;

        this.removeCube = () => {
            const allChildren = scene.children;
            const lastObject = allChildren[allChildren.length - 1];

            if(lastObject instanceof THREE.Mesh){
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        };

        this.addCube = () => {
            const cubeSize = Math.ceil((Math.random() * 3));
            const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.name = "cube-" + scene.children.length;


            // position the cube randomly in the scene 🤪
            cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
            cube.position.y = Math.round((Math.random() * 5));
            cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

            // add the cube to the scene
            scene.add(cube);
            this.numberOfObjects = scene.children.length;
        };
        this.outputObjects = () => {
            console.log(scene.children);
        };

        
        const gui = new dat.GUI();
        gui.add(this, 'rotationSpeed', 0, 0.5);
        gui.add(this, 'addCube');
        gui.add(this, 'removeCube');
        gui.add(this, 'outputObjects');
        gui.add(this, 'numberOfObjects').listen();
    }


    const stats = new Stats();
    stats.showPanel(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.dom);    

    // const controlMove = new TrackballControls(camera, renderer.domElement);
    // controlMove.rotateSpeed = 2;
    // controlMove.dynamicDampingFactor = 0.15;

    const trackballControls = new TrackballControls(camera, renderer.domElement);
    const clock = new THREE.Clock();

    window.addEventListener('resize', function () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    const render = () => {
        stats.update();
        // controlMove.update();
        trackballControls.update(clock.getDelta());

        scene.traverse((e) => {
            if(e instanceof THREE.Mesh && e != plane){
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}
window.onload = init;