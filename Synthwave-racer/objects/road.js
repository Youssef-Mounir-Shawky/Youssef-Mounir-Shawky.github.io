import * as THREE from 'https://unpkg.com/three@0.160.1/build/three.module.js';
import { ROAD_LENGTH, ROAD_SPEED } from '../utils/constants.js';

let roadMesh;

export function createRoad(scene) {
    const geometry = new THREE.PlaneGeometry(20, ROAD_LENGTH, 20, 200);

    const material = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5,
        wireframe: true
    });

    roadMesh = new THREE.Mesh(geometry, material);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.z = -ROAD_LENGTH / 2;

    scene.add(roadMesh);
}

export function updateRoad(time) {
    if (!roadMesh) return;

    const z = (time * ROAD_SPEED) % ROAD_LENGTH;
    roadMesh.position.z = z - ROAD_LENGTH / 2;
}
