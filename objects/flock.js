import * as THREE from 'three';
import { Stork } from './strok.js';

let storks = [];
const flockCenter = new THREE.Vector3(0, 25, -200); //start b3eed
const flockDirection = new THREE.Vector3(0, 0, 1); //move towards cam (0,0,1)

const RESPOND_Z = 100;
const START_Z = -300;
const RELATIVE_SPEED = 0.3;

export function createFlock(scene, count = 15, listener = null) {
    storks = [];
    for (let i = 0; i < count; i++) {
        storks.push(new Stork(scene, { listener }));
    }
}

export function updateFlock(delta, time) {
    flockCenter.z += RELATIVE_SPEED * (delta * 60);

    flockCenter.x = Math.sin(time * 0.2) * 10;
    flockCenter.y = 25 + Math.sin(time * 0.5) * 5;

    if (flockCenter.z > RESPOND_Z) {
        flockCenter.z = START_Z;
        storks.forEach(s => {
            s.relativePos.x = (Math.random() - 0.5) * 30;
            s.relativePos.z = (Math.random() - 0.5) * 20;
        });
    }

    storks.forEach(stork => stork.update(delta, time, flockCenter, flockDirection));
}
