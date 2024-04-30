import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import Stats from 'stats.js';
import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils.js';
import { Face } from 'three/addons/math/ConvexHull.js';
import * as dat from 'dat.gui';


const init = () => {
    const stats = new Stats();
    stats.showPanel(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.dom);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.add(camera);

    camera.position.x = -20;
    camera.position.y = 25;
    camera.position.z = 20;
    camera.lookAt(new THREE.Vector3(5, 0, 0));

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.shadowMap.enabled = true;

      // create the ground plane
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);
    
    const ambientLight = new THREE.AmbientLight(0x494949);
    scene.add(ambientLight);

    document.body.appendChild(renderer.domElement);

    let steps = 0;

    const vertices = [
        new THREE.Vector3(1, 3, 1),
        new THREE.Vector3(1, 3, -1),
        new THREE.Vector3(1, -1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, 3, -1),
        new THREE.Vector3(-1, 3, 1),
        new THREE.Vector3(-1, -1, -1),
        new THREE.Vector3(-1, -1, 1)
    ];
  
    const faces = [
        new Face(0, 2, 1),
        new Face(2, 3, 1),
        new Face(4, 6, 5),
        new Face(6, 7, 5),
        new Face(4, 5, 1),
        new Face(5, 0, 1),
        new Face(7, 6, 2),
        new Face(6, 3, 2),
        new Face(5, 7, 0),
        new Face(7, 2, 0),
        new Face(1, 3, 4),
        new Face(3, 6, 4),
    ];

    const geom = new THREE.ShapeGeometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeVertexNormals();
    
    const material = [
        new THREE.MeshBasicMaterial({color:0x000000, wireframe: true}),
        new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true})
    ];

    const mesh = SceneUtils.createMultiMaterialObject(geom, material);
    mesh.castShadow = true;
    mesh.children.forEach(function (e) {
        e.castShadow = true;
    });

    scene.add(mesh);

    const spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI/4);
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.position.set(-40, 30, 30);
    spotLight.castShadow = true;
    spotLight.lookAt(mesh);

    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    scene.add(spotLight);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);

    function addControl(x, y, z) {
        const controls = new function () {
            this.x = x;
            this.y = y;
            this.z = z;
        };
  
        return controls;
    }
  
    const controlPoints = [];
    controlPoints.push(addControl(3, 5, 3));
    controlPoints.push(addControl(3, 5, 0));
    controlPoints.push(addControl(3, 0, 3));
    controlPoints.push(addControl(3, 0, 0));
    controlPoints.push(addControl(0, 5, 0));
    controlPoints.push(addControl(0, 5, 3));
    controlPoints.push(addControl(0, 0, 0));
    controlPoints.push(addControl(0, 0, 3));

    const gui = new dat.GUI();
    gui.add(new function () {
      this.clone = function () {

          const clonedGeometry = mesh.children[0].geometry.clone();
          const materials = [
              new THREE.MeshLambertMaterial({opacity: 0.8, color: 0xff44ff, transparent: true}),
              new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
          ];

          const mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeometry, materials);
          mesh2.children.forEach(function (e) {
              e.castShadow = true
          });

          mesh2.translateX(5);
          mesh2.translateZ(5);
          mesh2.name = "clone";
          scene.remove(scene.getChildByName("clone"));
          scene.add(mesh2);


      }
    }, 'clone');

    for (let i = 0; i < 8; i++) {

        let f1 = gui.addFolder('Vertices ' + (i + 1));
        f1.add(controlPoints[i], 'x', -10, 10);
        f1.add(controlPoints[i], 'y', -10, 10);
        f1.add(controlPoints[i], 'z', -10, 10);

    }
  

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

        const vertices = [];
        for (var i = 0; i < 8; i++) {
            vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z));
        }

        mesh.children.forEach(function (e) {
            try{
                e.geometry.vertices = vertices;
                e.geometry.verticesNeedUpdate = true;
                e.geometry.computeVertexNormals();
                delete e.geometry.__directGeometry
            }catch(e){
                console.error(`Algo salió mal ${e}`)
            }

        });
  

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
    render();
};

window.onload = init;
