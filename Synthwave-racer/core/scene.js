//scene.js
import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c2c); // Deep synthwave purple-blue
    return scene;
}