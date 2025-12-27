import * as THREE from 'three';
import { Stork } from './strok.js';

let storks = [];
const flockCenter = new THREE.Vector3(0, 25, -100);
const flockDirection = new THREE.Vector3(0, 0, 1); // Direction vector

export function createFlock(scene, count = 15) {
    storks = [];
    for (let i = 0; i < count; i++) {
        storks.push(new Stork(scene));
    }
}

export function updateFlock(delta, time) {
    // 1. Move the Flock Center through the scene
    // Let's make it fly in a large lazy loop or just continuously forward
    // For a racer, maybe it flies across the road?

    // Path: A large circle in the sky
    const pathRadius = 150;
    const pathSpeed = 0.15;

    flockCenter.x = Math.sin(time * pathSpeed) * pathRadius;
    flockCenter.z = -150 + Math.cos(time * pathSpeed) * pathRadius;
    flockCenter.y = 30 + Math.sin(time * 0.5) * 5; // Slight rising/falling

    // 2. Calculate Direction (Tangent to the path)
    const nextTime = time + 0.1;
    const nextX = Math.sin(nextTime * pathSpeed) * pathRadius;
    const nextZ = -150 + Math.cos(nextTime * pathSpeed) * pathRadius;

    flockDirection.set(
        nextX - flockCenter.x,
        0,
        nextZ - flockCenter.z
    ).normalize();

    // 3. Update individual storks
    storks.forEach(stork => stork.update(delta, time, flockCenter, flockDirection));
}
