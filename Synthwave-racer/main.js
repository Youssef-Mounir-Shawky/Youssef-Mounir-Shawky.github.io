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
import { setupCarAudio, startEngine, updateEnginePitch } from './audio/carAudio.js';
import { setupMusic, playMusic } from './audio/music.js';
import { ROAD_SPEED } from './utils/constants.js';


// Initialize core systems
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const composer = createComposer(renderer, scene, camera);

// Setup fog before objects so Water can detect it
setupFog(scene);

// Set up scene content
createRoad(scene);
createCar(scene);
createMountains(scene);
createWater(scene);
createSun(scene);
createSkybox(scene);
setupLights(scene);

// Audio Setup (Requires camera and car object)
// Note: createCar adds a placeholder carMesh immediately, named 'carObject'.
const { engineSound, listener } = setupCarAudio(camera, scene.getObjectByName('carObject') || scene);
setupMusic(listener);

// Initialize Flock with listener for positional birds sound
createFlock(scene, 20, listener);

let audioContextStarted = false;

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

    // Dynamic engine pitch (use a base speed + vertical sway or fake speed)
    updateEnginePitch(ROAD_SPEED);

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

async function initAudio() {
    if (listener && listener.context && !audioContextStarted) {
        const ctx = listener.context;
        if (ctx.state === 'suspended') {
            await ctx.resume().catch(e => console.error("Failed to resume AudioContext:", e));
            console.log("AudioContext resumed.");
        }
        startEngine();
        playMusic();
        audioContextStarted = true;
    }
}

window.addEventListener('click', initAudio);
window.addEventListener('keydown', initAudio);
