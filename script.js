document.getElementById('startButton').addEventListener('click', initializeCube);

function initializeCube() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('cubeCanvas').style.display = 'block';
    document.getElementById('timer').style.display = 'block';
    document.getElementById('instructions').style.display = 'block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('cubeCanvas')});
    renderer.setSize(window.innerWidth, window.innerHeight);

    const testCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(testCube);

    const cubeSize = 3;
    const cubeletSize = 1;
    const cubelets = [];

    const colors = [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "white"
    ];

    for (let x = 0; x < cubeSize; x++) {
        for (let y = 0; y < cubeSize; y++) {
            for (let z = 0; z < cubeSize; z++) {
                const geometry = new THREE.BoxGeometry(cubeletSize, cubeletSize, cubeletSize);
                const materials = [
                    new THREE.MeshBasicMaterial({color: colors[0]}),
                    new THREE.MeshBasicMaterial({color: colors[1]}),
                    new THREE.MeshBasicMaterial({color: colors[2]}),
                    new THREE.MeshBasicMaterial({color: colors[3]}),
                    new THREE.MeshBasicMaterial({color: colors[4]}),
                    new THREE.MeshBasicMaterial({color: colors[5]}),
                ];

                const cubelet = new THREE.Mesh(geometry, materials);
                cubelet.position.set(x - 1, y - 1, z - 1);
                cubelets.push(cubelet);
                scene.add(cubelet);
            }
        }
    }

    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    function rotateSize(axis, layer, direction) {
        const rotationAxis = new THREE.Vector3();
        rotationAxis[axis] = 1;
        const rotationMatrix = new THREE.Matrix4().makeRotationAxis(rotationAxis, direction * Math.PI / 2);

        cubelets.forEach(cubelet => {
            if (Math.round(cubelet.position[axis]) === layer) {
                cubelet.applyMatrix4(rotationMatrix);
                cubelet.position.set(
                    Math.round(cubelet.position.x),
                    Math.round(cubelet.position.y),
                    Math.round(cubelet.position.z)
);
            }
        });
    }

    function randomRotation() {
        const axes = ['x', 'y', 'z'];
        const layers = [-1, 0, 1];
        const directions = [-1, 1];

        for (let i = 0; i < 20; i++) {
            const axis = axes[Math.floor(Math.random() * axes.length)];
            const layer = layers[Math.floor(Math.random() * layers.length)];
            const direction = directions[Math.floor(Math.random() * directions.length)];
            rotateSize(axis, layer, direction);
        }
    }

    randomRotation();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'w':
                rotateSize('z', -1, 1);
                break;
            case 's':
                rotateSize('z', 1, -1);
                break;
            case 'a':
                rotateSize('y', -1, 1);
                break;
            case 'd':
                rotateSize('y', 1, -1);
                break;
            case 'm':
                rotateSize('y', 0, -1);
        }
    });
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight)
    });

    let startTime = Date.now();
    let timerInterval = setInterval(updateTimer, 1000);

    function updateTimer() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        document.getElementById('timer').innerText = `Timer: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

        const solvedColors = [
            ["red", "red", "red", "red", "red", "red", "red", "red", "red"],
            ["orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange",],
            ["yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow"],
            ["green", "green", "green", "green", "green", "green", "green", "green"],
            ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
            ["white", "white", "white", "white", "white", "white", "white", "white", "white"],
        ];

        const currentColors = cubelets.flatMap(cubelet => cubelet.material.map(material => material.color.getHex()));

        for (let i = 0; i < solvedColors.length; i++) {
            if (!solvedColors[i].every((color, index) => color === currentColors[index])) {
                return;
            }
        }
    }

    const setTheme = (theme) => {
        localStorage.setItem('theme', theme);
        document.body.className = theme;
    }