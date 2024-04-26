function init (){
    // -- Your threejs code goes here --
}
window.onload = init;

const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // document.body.appendChild(renderer.domElement);

    // const axes = new THREE.AxesHelper(20);
    // scene.add(axes);

    const planeGeometry = new THREE.PlaneGeometry(60, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    cube.castShadow = true;
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    scene.castShadow = true;
    scene.add(sphere);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50);
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

    const pointLight = new THREE.PointLight(0xff0000, 1, 100);
    pointLight.position.set(0, 20, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    pointLight.shadow.mapSize.width = window.innerWidth;
    pointLight.shadow.mapSize.height = window.innerHeight;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 100;

    const effect = new AsciiEffect(renderer); // Crea el efecto AsciiEffect con el renderer
    effect.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(effect.domElement);

    window.addEventListener('resize', function () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        effect.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const controls = new TrackballControls(camera, effect.domElement);
    controls.rotateSpeed = 4;
    controls.dynamicDampingFactor = 0.15;

    const gui = new dat.GUI();
    gui.add(controls, 'rotateSpeed', 0, 4);
    gui.add(controls, 'dynamicDampingFactor', 0, 0.15);

    let step = 0;

    const render = function () {
        stats.update();

        step += controls.rotateSpeed;

        sphere.position.x = 20 + (10 * Math.cos(step));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        cube.rotation.x += controls.rotateSpeed;
        cube.rotation.y += controls.rotateSpeed;
        cube.rotation.z += controls.rotateSpeed;

        controls.update();
        requestAnimationFrame(render);
        effect.render(scene, camera);
    };
    render();