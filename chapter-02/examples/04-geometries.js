import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import Stats from 'stats.js';

const init = () => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.add(camera);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xEEEEEE);
    renderer.shadowMap.enabled = true;

    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-40, 60, -10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    scene.add(directionalLightHelper);

    document.body.appendChild(renderer.domElement);

    const stats = new Stats();
    stats.showPanel(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.dom);

    const controlMove = new TrackballControls(camera, renderer.domElement);
    controlMove.rotateSpeed = 2;
    controlMove.dynamicDampingFactor = 0.15;

    addGeometries(scene, renderer);

    const render = () => {
        stats.update();
        controlMove.update();

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
    render();
};
window.onload = init;

const addGeometries = (scene, renderer) => {
    const geoms = [];

    geoms.push(new THREE.CylinderGeometry(1, 4, 4));
    geoms.push(new THREE.BoxGeometry(2, 2, 2));
    geoms.push(new THREE.SphereGeometry(2));
    geoms.push(new THREE.IcosahedronGeometry(4));

    const points = [
        new THREE.Vector3(2, 2, 2),
        new THREE.Vector3(2, 2, -2),
        new THREE.Vector3(-2, 2, -2),
        new THREE.Vector3(-2, 2, 2),
        new THREE.Vector3(2, -2, 2),
        new THREE.Vector3(2, -2, -2),
        new THREE.Vector3(-2, -2, -2),
        new THREE.Vector3(-2, -2, 2)
    ];
    // geoms.push(new THREE.ConvexGeometry(points));

    const pts = [];
    const detail = 0.1;
    const radius = 3;
    for (let angle = 0.0; angle < Math.PI; angle += detail)
        pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    geoms.push(new THREE.LatheGeometry(pts, 12));

    geoms.push(new THREE.OctahedronGeometry(3));

    // geoms.push(new THREE.ParametricGeometry(THREE.ParametricGeometries.mobius3d, 20, 10));

    geoms.push(new THREE.TetrahedronGeometry(3));

    geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));

    geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

    let j = 0;
    for (let i = 0; i < geoms.length; i++) {
        const cubeMaterial = new THREE.MeshLambertMaterial({ wireframe: true, color: Math.random() * 0xffffff });

        const materials = [
            new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff, shading: THREE.FlatShading }),
            new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
        ];

        const mesh = new THREE.Mesh(geoms[i], materials);
        mesh.castShadow = true;

        mesh.position.x = -24 + ((i % 4) * 12);
        mesh.position.y = 4;
        mesh.position.z = -8 + (j * 12);

        if ((i + 1) % 4 == 0) j++;
        scene.add(mesh);
    }
};