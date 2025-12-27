import * as THREE from 'three';

export function setupLights(scene) {
  // Soft ambient light so everything stays visible
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Directional light from the FRONT (matching sun direction)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 10, -20);
  scene.add(directionalLight);

  // Subtle neon accents 
  const pinkLight = new THREE.PointLight(0xff66ff, 0.8, 30);
  pinkLight.position.set(-6, 3, 5);
  scene.add(pinkLight);

  const cyanLight = new THREE.PointLight(0x66ffff, 0.8, 30);
  cyanLight.position.set(6, 3, 5);
  scene.add(cyanLight);
}
