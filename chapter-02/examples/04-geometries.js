import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import Stats from 'stats.js';
import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils.js';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries.js";


const init = () => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.add(camera);

    camera.position.x = -50;
    camera.position.y = 30;
    camera.position.z = 20;
    camera.lookAt(new THREE.Vector3(-10, 0, 0));

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.shadowMap.enabled = true;

    document.body.appendChild(renderer.domElement);

    const spotLight = new THREE.SpotLight(0xffffff, 100, 150, Math.PI / 4, 1); // Increased intensity to 2
    spotLight.position.set(10, 50, 10);
    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    scene.add(spotLight);

    const spotLight2 = new THREE.SpotLight(0x00ff00, 100, 150, Math.PI / 4, 1); // Increased intensity to 2
    spotLight2.position.set(10, 50, -10);
    spotLight2.castShadow = true;

    spotLight2.shadow.mapSize.width = 1024;
    spotLight2.shadow.mapSize.height = 1024;

    spotLight2.shadow.camera.near = 10;
    spotLight2.shadow.camera.far = 4000;
    spotLight2.shadow.camera.fov = 30;
    scene.add(spotLight2);

    const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2);
    scene.add(spotLightHelper2);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);

    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.castShadow = true;
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    let step = 0;

    const addGeometries = (scene) => {
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
        geoms.push(new ConvexGeometry(points));

        const pts = [];
        const detail = 0.1;
        const radius = 3;
        for (let angle = 0.0; angle < Math.PI; angle += detail)
            pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        geoms.push(new THREE.LatheGeometry(pts, 12));

        geoms.push(new THREE.OctahedronGeometry(3));

        geoms.push( new ParametricGeometry(ParametricGeometries.mobius3d, 20, 10))

        geoms.push(new THREE.TetrahedronGeometry(3));

        geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));

        geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));


        let j = 0;
        for (let i = 0; i < geoms.length; i++) {
            const cubeMaterial = new THREE.MeshLambertMaterial({
                wireframe: true,
                color: Math.random() * 0xffffff
            });

            const materials = [
                new THREE.MeshLambertMaterial({
                    color: Math.random() * 0xffffff
                }),
                new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    wireframe: true
                })
            ];

            const mesh = SceneUtils.createMultiMaterialObject(geoms[i], materials);
            mesh.traverse(function (e) {
                e.castShadow = true
            });

            mesh.position.x = -24 + ((i % 4) * 12);
            mesh.position.y = 4;
            mesh.position.z = -8 + (j * 12);

            if ((i + 1) % 4 == 0) j++;
            scene.add(mesh);
        }
    };

    addGeometries(scene);

    const stats = new Stats();
    stats.showPanel(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.dom);

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
        trackballControls.update(clock.getDelta());

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
    render();
};

window.onload = init;
