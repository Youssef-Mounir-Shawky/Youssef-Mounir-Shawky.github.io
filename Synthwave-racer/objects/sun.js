/**
 * 
 * 
 * Fixes applied:
 * - Removed ALL usage of `window` (was storing scene and pulses globally)
 * - Now uses module-scoped variables: `sceneRef`, `pulses`
 * - Prevents memory leaks, improves encapsulation, and avoids conflicts
 * - More reliable and debuggable
 * 
 * Why? Using `window` breaks modularity and can cause race conditions.
 * All state should live inside the module that owns it.
 * 
 */

import * as THREE from 'three';

let sunMesh = null;
let sceneRef = null;  // Store scene locally
let pulses = [];      // Local array — no window.pulses!
let lastPulseTime = 0;

export function createSun(scene) {
    sceneRef = scene;

    const sunRadius = 22;
    const sunGeometry = new THREE.SphereGeometry(sunRadius, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.98
    });

    sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.set(0, 25, -80);
    scene.add(sunMesh);
}

export function updateSun(time) {
    if (!sunMesh || !sceneRef) return;

    // Gentle pulsing scale and opacity
    const sunPulse = 1 + Math.sin(time * 0.2) * 0.05;
    sunMesh.scale.set(sunPulse, sunPulse, sunPulse);
    sunMesh.material.opacity = 0.9 + Math.sin(time * 0.3) * 0.08;

    // Emit a new pulse every 3 seconds
    if (time - lastPulseTime > 3.0) {
        createPulse(time);
        lastPulseTime = time;
    }

    updatePulses(time);
}

function createPulse(startTime) {
    const pulseGeometry = new THREE.SphereGeometry(1, 16, 16);
    const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0xcc00ff,
        transparent: true,
        opacity: 0.4,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });

    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
    pulse.position.copy(sunMesh.position);
    pulse.userData = { startTime };

    sceneRef.add(pulse);
    pulses.push(pulse);

    // Keep only last 4 pulses
    if (pulses.length > 4) {
        const oldPulse = pulses.shift();
        sceneRef.remove(oldPulse);
    }
}

function updatePulses(time) {
    for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const elapsed = time - pulse.userData.startTime;
        const duration = 6.0;

        if (elapsed < duration) {
            const progress = elapsed / duration;
            const currentSize = 18 + (120 - 18) * progress;
            pulse.scale.set(currentSize, currentSize, currentSize);
            pulse.material.opacity = 0.4 * (1 - Math.pow(progress, 0.7));
            const colorShift = 1 - progress * 0.5;
            pulse.material.color.setRGB(0.8 * colorShift, 0, 1.0 * colorShift);
        } else {
            sceneRef.remove(pulse);
            pulses.splice(i, 1);
        }
    }
}