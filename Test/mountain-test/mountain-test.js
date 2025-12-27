import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x220033);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(200, 100, 200);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(100, 100, 50);
scene.add(dirLight);

// Axis and Grid Helpers
scene.add(new THREE.AxesHelper(100)); // Red = X, Green = Y, Blue = Z
scene.add(new THREE.GridHelper(500, 10));

// Load Mountain
const loader = new GLTFLoader();
const modelPath = '../../models/mountain.glb';
let mountain;

loader.load(modelPath, (gltf) => {
    mountain = gltf.scene;
    mountain.scale.set(100, 100, 100);
    scene.add(mountain);
    console.log("Mountain loaded in test. Use Left/Right arrows to rotate!");
}, undefined, (error) => {
    console.error("Error loading mountain in test:", error);
});

// Interactive Rotation
window.addEventListener('keydown', (e) => {
    if (!mountain) return;

    const step = 0.1; // Radians
    if (e.key === 'ArrowLeft') {
        mountain.rotation.y += step;
    } else if (e.key === 'ArrowRight') {
        mountain.rotation.y -= step;
    }

    // Convert to degrees for easier reading
    const degrees = (mountain.rotation.y * 180 / Math.PI).toFixed(1);
    console.log(`Current Rotation Y: ${mountain.rotation.y.toFixed(3)} rad (${degrees} deg)`);
    document.getElementById('info').innerHTML = `Mountain Orientation Test<br>Use mouse to orbit<br>Use Left/Right ARROWS to rotate model<br>Current: ${degrees}°`;
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
