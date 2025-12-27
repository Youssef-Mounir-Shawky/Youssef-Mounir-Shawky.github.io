import * as THREE from 'three';

export function setupFog(scene) {
  const fogColor = new THREE.Color(0x3d2043);

  // Very subtle exponential fog - only affects far mountains
  scene.fog = new THREE.FogExp2(fogColor, 0.0008);
}
