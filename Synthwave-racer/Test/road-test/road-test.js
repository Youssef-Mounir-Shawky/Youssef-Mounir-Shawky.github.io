import * as THREE from 'https://unpkg.com/three@0.160.1/build/three.module.js';
import { createRoad, updateRoad } from '../../objects/road.js';
//scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0c0c2c);
//cam
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);
camera.lookAt(0, 0, -50);
//renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

createRoad(scene);

//loop
function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;
    updateRoad(time);

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
