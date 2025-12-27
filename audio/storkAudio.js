import * as THREE from 'three';

let birdsSounds = [];
let isLoaded = false;
let birdsBuffer = null;

export function setupStorkAudio(listener, storkMesh) {
    const sound = new THREE.PositionalAudio(listener);

    // Use birds.mp3 from the sounds directory
    const audioLoader = new THREE.AudioLoader();
    const audioPath = new URL('../sounds/birds.mp3', import.meta.url).href;

    if (!birdsBuffer) {
        audioLoader.load(audioPath, (buffer) => {
            birdsBuffer = buffer;
            applyBufferToSound(sound, buffer);
            isLoaded = true;
            console.log("Stork audio loaded successfully");
        }, undefined, (err) => {
            console.warn("Stork audio (birds.mp3) failed to load. Please ensure it exists in /sounds/ folder.", err);
        });
    } else {
        applyBufferToSound(sound, birdsBuffer);
    }

    storkMesh.add(sound);
    birdsSounds.push(sound);
    return sound;
}

function applyBufferToSound(sound, buffer) {
    sound.setBuffer(buffer);
    sound.setRefDistance(10);
    sound.setLoop(true);
    sound.setVolume(0.04);
}

export { isLoaded };

export function stopBirds() {
    birdsSounds.forEach(sound => {
        if (sound.isPlaying) {
            sound.stop();
        }
    });
}
