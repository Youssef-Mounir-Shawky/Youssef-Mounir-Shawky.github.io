/**
 * Car object with keyboard controls and shadows
 * 
 * Fixes applied:
 * - Changed Three.js import to `from 'three'` to match import map in index.html
 * - Added a placeholder `carMesh` at origin to prevent `getCarPosition()` from returning null
 * - Ensures camera always has a valid target, even while model is loading
 * - Wheels rotate using global `time` (not deltaTime) for smooth, deterministic animation
 * - Model path is now relative: `./models/car.glb` (no leading slash)
 * - Added keyboard controls for left/right movement (A/D keys)
 * - Added shadow casting and receiving
 * 
 * Note: GLTFLoader still uses CDN URL – that's OK because it's not part of core Three.js.
 * 
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ROAD_SPEED } from '../utils/constants.js';

// Placeholder always exists at origin (0,0,0)
let carMesh = new THREE.Object3D();
carMesh.name = 'carObject';
let wheels = [];

// Movement variables
let targetX = 0;
const moveSpeed = 0.5; // Units per key press
const lerpSpeed = 5; // Smoothness of movement
const maxX = 5; // Maximum distance left/right from center
const minX = -5;

// Keyboard state
const keys = {
    a: false,
    d: false
};

// Set up keyboard listeners
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'a' || key === 'd') {
        keys[key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'a' || key === 'd') {
        keys[key] = false;
    }
});

export function createCar(scene) {
    scene.add(carMesh); // Add placeholder immediately

    const loader = new GLTFLoader();
    loader.load('./models/car.glb', (gltf) => {
        const loadedCar = gltf.scene;
        carMesh.scale.set(3, 3, 3);
        loadedCar.rotation.set(0, Math.PI, 0);

        // Clear any existing children (e.g., from placeholder)
        while (carMesh.children.length > 0) {
            carMesh.remove(carMesh.children[0]);
        }

        // Add loaded model as child
        carMesh.add(loadedCar);

        // Enable shadows for all meshes in the car
        loadedCar.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                // Find wheel meshes for animation
                if (child.name.toLowerCase().includes('wheel')) {
                    wheels.push(child);
                }
            }
        });
    }, undefined, (error) => {
        console.error('Error loading car model:', error);
    });
}

export function updateCar(time, delta) {
    // Handle keyboard input
    if (keys.a) {
        targetX -= moveSpeed * delta * 10; // Scale by delta for frame-rate independence
    }
    if (keys.d) {
        targetX += moveSpeed * delta * 10;
    }
    // Test keyboard
    window.addEventListener('keydown', (e) => {
        console.log('Key pressed:', e.key);
    });

    // Clamp target position
    targetX = Math.max(minX, Math.min(maxX, targetX));

    // Smoothly interpolate to target position
    carMesh.position.x += (targetX - carMesh.position.x) * lerpSpeed * delta;

    // Rotate wheels based on global time for smooth sync
    wheels.forEach(wheel => {
        wheel.rotation.x = time * ROAD_SPEED * 0.5; // Adjust speed factor as needed
    });
}

export function getCarPosition() {
    // Always returns a valid Vector3 – never null
    return carMesh.position.clone();
}