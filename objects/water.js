import * as THREE from 'three';
import { ROAD_WIDTH, ROAD_SPEED, ROAD_LENGTH } from '../utils/constants.js';
import { Water } from 'https://unpkg.com/three@0.160.1/examples/jsm/objects/Water.js';

let waterLeft;
let waterRight;

export function createWater(scene) {
  // Water extends far on both sides
  const waterWidth = 200;
  const waterLength = 1000;
  const waterOffset = (ROAD_WIDTH / 2 + 1 )-4; // Close to road edge

  // Create water geometry
  const waterGeometry = new THREE.PlaneGeometry(waterWidth, waterLength, 1, 1);

  // Load water normal map texture
  const textureLoader = new THREE.TextureLoader();
  const waterNormals = textureLoader.load(
    'https://threejs.org/examples/textures/waternormals.jpg',
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  );

  // Left water plane removed to make room for grass area
  /*
  waterLeft = new Water(waterGeometry, {
    textureWidth: 1024,
    textureHeight: 1024,
    waterNormals: waterNormals,
    sunDirection: new THREE.Vector3(0, 1, 0),
    sunColor: 0xff00ff,
    waterColor: 0x001e3f,
    distortionScale: 2.5,
    fog: scene.fog !== undefined,
    side: THREE.DoubleSide,
    alpha: 0.95
  });

  waterLeft.rotation.x = -Math.PI / 2;
  waterLeft.position.x = -waterOffset - waterWidth / 2;
  waterLeft.position.y = -1.0;
  waterLeft.position.z = -ROAD_LENGTH;
  scene.add(waterLeft);
  */
 
  // Right water plane
  waterRight = new Water(waterGeometry.clone(), {
    textureWidth: 1024,
    textureHeight: 1024,
    waterNormals: waterNormals,
    sunDirection: new THREE.Vector3(0, 1, 0),
    sunColor: 0xff00ff,
    waterColor: 0x001e3f,
    distortionScale: 2.5,
    fog: scene.fog !== undefined,
    side: THREE.DoubleSide,
    alpha: 0.95
  });

  waterRight.rotation.x = -Math.PI / 2;
  waterRight.position.x = waterOffset + waterWidth / 2;
  waterRight.position.y = -1.0;
  waterRight.position.z = -ROAD_LENGTH;

  // Only add waterRight since waterLeft is commented out
  scene.add(waterRight); // Removed waterLeft from here
}

export function updateWater(time) {
  // Check if waterRight exists before updating
  if (!waterRight) return;

  // Slower water animation for calmer, dreamy effect
  waterRight.material.uniforms['time'].value = time * 0.5;

  // Translate water in sync with road
  const offset = (time * ROAD_SPEED * 1000) % ROAD_LENGTH; // Added * 1000 for proper speed
  const zPosition = -ROAD_LENGTH + offset;

  waterRight.position.z = zPosition;
}