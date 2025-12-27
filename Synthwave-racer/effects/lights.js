/**
 * Basic lighting with shadow support
 */
import * as THREE from 'three';

export function setupLights(scene) {
    // Soft ambient light
    const ambientLight = new THREE.AmbientLight(0x3D2042, 10);
    scene.add(ambientLight);

    // Directional "sun" light with shadows
    const sunLight = new THREE.DirectionalLight(0x0980AF, 10);
    sunLight.position.set(0, 25, -40);

    // Enable shadows
    sunLight.castShadow = true;

    // Configure shadow quality
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;

    // Configure shadow camera
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;

    // Shadow camera frustum (adjust based on your scene size)
    const shadowSize = 30;
    sunLight.shadow.camera.left = -shadowSize;
    sunLight.shadow.camera.right = shadowSize;
    sunLight.shadow.camera.top = shadowSize;
    sunLight.shadow.camera.bottom = -shadowSize;

    // Reduce shadow artifacts
    sunLight.shadow.bias = -0.0005;

    scene.add(sunLight);
    const mountainLight = new THREE.DirectionalLight(0x3D2042, 10);
    mountainLight.position.set(-80, 50, -200);
    scene.add(mountainLight);


    // Optional: Visualize shadow camera for debugging
    // const helper = new THREE.CameraHelper(sunLight.shadow.camera);
    // scene.add(helper);
}