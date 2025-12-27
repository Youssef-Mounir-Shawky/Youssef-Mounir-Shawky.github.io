/**
 *  
 * 
 * Fixes applied:
 * - Changed Three.js import to `from 'three'` to match import map in index.html
 * - Added a placeholder `carMesh` at origin to prevent `getCarPosition()` from returning null
 * - Ensures camera always has a valid target, even while model is loading
 * - Wheels rotate using global `time` (not deltaTime) for smooth, deterministic animation
 * - Model path is now relative: `./models/car.glb` (no leading slash)
 * 
 * Note: GLTFLoader still uses CDN URL � that�s OK because it�s not part of core Three.js.
 * 
 */

import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

// Placeholder always exists at origin (0,0,0)
let carMesh = new THREE.Object3D();
let wheels = [];

export function createCar(scene) {
    scene.add(carMesh); // Add placeholder immediately

    const loader = new GLTFLoader();
    loader.load('./models/car.glb', (gltf) => {
        const loadedCar = gltf.scene;
        carMesh.scale.set(2, 2, 2);


        // Clear any existing children (e.g., from placeholder)
        while (carMesh.children.length > 0) {
            carMesh.remove(carMesh.children[0]);
        }

        // Add loaded model as child
        carMesh.add(loadedCar);

        // Find wheel meshes for animation
        wheels = [];
        loadedCar.traverse(child => {
            if (child.isMesh && child.name.toLowerCase().includes('wheel')) {
                wheels.push(child);
            }
        });
    }, undefined, (error) => {
        console.error('Error loading car model:', error);
    });
}

export function updateCar(time) {
    // Rotate wheels based on global time for smooth sync
    wheels.forEach(wheel => {
        wheel.rotation.x = time * 5;
    });
}

export function getCarPosition() {
    // Always returns a valid Vector3 � never null
    return carMesh.position.clone();
}