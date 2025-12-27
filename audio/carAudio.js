import * as THREE from 'three';

let listener;
let engineSound;
let isLoaded = false;

export function setupCarAudio(camera, carObject) {
    // 1. Create AudioListener and add to camera
    listener = new THREE.AudioListener();
    camera.add(listener);

    // 2. Create PositionalAudio object
    engineSound = new THREE.PositionalAudio(listener);

    // 3. Load the sound file
    const audioLoader = new THREE.AudioLoader();
    const audioPath = new URL('../sounds/car.mp3', import.meta.url).href;

    audioLoader.load(audioPath, (buffer) => {
        engineSound.setBuffer(buffer);
        engineSound.setRefDistance(5); // Distance at which volume starts to drop
        engineSound.setLoop(true);
        engineSound.setVolume(0.5);
        isLoaded = true;

        console.log("Car audio loaded successfully");
    }, (progress) => {
        // console.log(`Audio loading: ${(progress.loaded / progress.total * 100)}%`);
    }, (error) => {
        console.error("Error loading car audio:", error);
    });

    // 4. Attach sound to the car object
    carObject.add(engineSound);

    // Return reference for manual control if needed
    return { listener, engineSound };
}

export function startEngine() {
    if (isLoaded && engineSound && !engineSound.isPlaying) {
        engineSound.play();
        console.log("Engine started");
    }
}

export function stopEngine() {
    if (engineSound && engineSound.isPlaying) {
        engineSound.stop();
    }
}

export function updateEnginePitch(speed) {
    if (engineSound && isLoaded) {
        // Modulate pitch based on speed
        // Speed is around 80. Normalize to range ~0-1 for pitch calculation.
        // Old formula: 0.8 + speed * 0.5 (was assuming speed < 1)
        // New formula: 0.8 + (speed * 0.012) -> at 80, 0.8 + 0.96 = 1.76
        const pitch = 0.8 + speed * 0.012;
        engineSound.setPlaybackRate(Math.min(pitch, 2.5)); // Cap at 2.5x
    }
}
