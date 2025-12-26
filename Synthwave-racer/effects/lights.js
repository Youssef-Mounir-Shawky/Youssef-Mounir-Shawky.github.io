/**
 * Basic lighting so MeshStandardMaterial objects are visible
 */
import * as THREE from 'three';

export function setupLights(scene) {
    // Soft ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    // Directional "sun" light
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(10, 20, 10);
    scene.add(sunLight);
}