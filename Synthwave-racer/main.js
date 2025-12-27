// main.js
import { createScene } from './core/scene.js';
import { createCamera } from './core/camera.js';
import { createRenderer } from './core/renderer.js';
import { createComposer } from './core/composer.js';
import { getTime, updateClock, getDelta } from './core/clock.js';

import { createRoad, updateRoad } from './objects/road.js';
import { createCar, updateCar, getCarPosition } from './objects/car.js';
import { createMountains, updateMountains } from './objects/mountains.js';
import { createSun, updateSun } from './objects/sun.js';
import { createSkybox, updateSkybox } from './objects/sky.js';
import { createFlock, updateFlock } from './objects/flock.js';
import { createWater, updateWater } from './objects/water.js';

import { setupLights } from './effects/lights.js';
import { setupFog } from './effects/fog.js';
import { updateCamera } from './animation/cameraFollow.js';


// ======================
// INITIALIZATION
// ======================
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const composer = createComposer(renderer, scene, camera);


// ======================
// SCENE CONTENT
// ======================
createRoad(scene);
createCar(scene);
createMountains(scene);
createWater(scene);
createSun(scene);
createSkybox(scene);
createFlock(scene, 20); // Add a flock of 20 storks

setupLights(scene);
setupFog(scene);

// ======================
// ANIMATION LOOP
// ======================
function animate() {
    requestAnimationFrame(animate);

    const delta = updateClock();
    const time = getTime();

    // Update all objects
    updateRoad(time);
    updateCar(time, delta);
    updateMountains(time);
    updateSun(time);
    updateSkybox(time);
    updateFlock(delta, time);
    updateWater(time);

    // Update camera based on car position
    const carPos = getCarPosition();
    updateCamera(camera, carPos, time);

   

    // Render frame using composer (for post-processing effects)
    composer.render();
}

// Start animation
animate();

// ======================
// EVENTS
// ======================
// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// Handle audio context activation (requires user interaction)
let audioContextStarted = false;

window.addEventListener('click', async () => {
    if (!audioContextStarted && carSound.listener) {
        const ctx = carSound.listener.context;
        if (ctx.state === 'suspended') {
            try {
                await ctx.resume();
                audioContextStarted = true;
                console.log("AudioContext resumed successfully");
                
                // Start playing the sound immediately after resume
                if (carSound.engineSound && carSound.engineSound.buffer) {
                    carSound.engineSound.play();
                    carSound.isPlaying = true;
                }
            } catch (error) {
                console.error("Failed to resume AudioContext:", error);
            }
        }
    }
});
