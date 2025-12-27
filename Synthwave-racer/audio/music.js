import * as THREE from 'three';

let music;
let isLoaded = false;

export function setupMusic(listener) {
    music = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    const audioPath = new URL('../sounds/backgroundMusic.mp3', import.meta.url).href;

    audioLoader.load(audioPath, (buffer) => {
        music.setBuffer(buffer);
        music.setLoop(true);
        music.setVolume(0.2);
        isLoaded = true;
        console.log("Background music loaded");
    }, undefined, (err) => {
        console.warn("Background music failed to load", err);
    });

    return { music };
}

export function playMusic() {
    if (isLoaded && music && !music.isPlaying) {
        music.play();
    }
}

export function stopMusic() {
    if (music && music.isPlaying) {
        music.stop();
    }
}
