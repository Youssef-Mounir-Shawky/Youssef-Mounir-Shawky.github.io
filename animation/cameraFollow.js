import * as THREE from 'three';

const offset = new THREE.Vector3(0, 4, 15);
const smoothness = 0.1;

export function updateCamera(camera, carPosition, time) {
  if (!carPosition) return;

  // Very subtle side sway 
  const sway = Math.sin(time * 1.2) * 0.15;

  const desiredPosition = new THREE.Vector3(
    carPosition.x + sway,
    carPosition.y + offset.y,
    carPosition.z + offset.z
  );

  camera.position.lerp(desiredPosition, smoothness);

  // Look directly at the car (slightly above center)
  camera.lookAt(
    carPosition.x,
    carPosition.y + 1,
    carPosition.z
  );
}
