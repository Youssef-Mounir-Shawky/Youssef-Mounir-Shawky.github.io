//main.js
// Core imports
import { createScene } from './core/scene.js';
import { createCamera } from './core/camera.js';
import { createRenderer } from './core/renderer.js';
import { getTime, getDelta } from './core/clock.js';

// Object imports
import { createRoad, updateRoad } from './objects/road.js';
import { createCar, updateCar } from './objects/car.js';
import { createMountains, updateMountains } from './objects/mountains.js';
import { createSun, updateSun } from './objects/sun.js';
import { createSkybox, updateSkybox } from './objects/sky.js';
import { createFlock, updateFlock } from './objects/flock.js';
import { createWater, updateWater } from './objects/water.js';

// Effect & animation imports
import { setupLights } from './effects/lights.js';
import { setupFog } from './effects/fog.js';
import { updateCamera } from './animation/cameraFollow.js';
import { getCarPosition } from './objects/car.js';

// Initialize core systems
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

// Set up scene content
createRoad(scene);
createCar(scene);
createMountains(scene);
createWater(scene);
createSun(scene);
createSkybox(scene);
createFlock(scene, 20); // Add a flock of 20 storks
setupLights(scene);
setupFog(scene);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const time = getTime();

    // Update all objects
    updateRoad(time);
    updateCar(time);
    updateMountains(time);
    updateSun(time);
    updateSkybox(time);
    updateFlock(getDelta(), time);
    updateWater(time);

    // Update camera based on car position
    const carPos = getCarPosition();
    updateCamera(camera, carPos, time);

    // Render frame
    renderer.render(scene, camera);
}

// Start animation
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});