import * as THREE from 'three';
import { createFlock, updateFlock } from '../../objects/flock.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.set(0, 50, 200); // Higher and further back to see the flock path

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(10, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// Stork Flock
createFlock(scene, 15);

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    // We need to pass both delta (for mixer) and time (for movement)
    // objects/strok.js expects: updateStork(delta, time)
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    updateFlock(delta, time);
    controls.update();

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
