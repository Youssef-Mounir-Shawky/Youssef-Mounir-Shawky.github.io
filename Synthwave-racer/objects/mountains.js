import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ROAD_SPEED } from '../utils/constants.js';

let mountainInstances = [];
const MOUNTAIN_Z_RANGE = 4000; // Much larger range for more depth
const MOUNTAIN_COUNT = 15;
const MOUNTAIN_SPACING = MOUNTAIN_Z_RANGE / MOUNTAIN_COUNT;
const MOUNTAIN_X = -100; // Farther left to avoid road overlap (Road ends at -10)

export function createMountains(scene) {
  const loader = new GLTFLoader();
  const modelPath = new URL('../models/mountain.glb', import.meta.url).href;

  for (let i = 0; i < MOUNTAIN_COUNT; i++) {
    loader.load(modelPath, (gltf) => {
      const mtn = gltf.scene;

      // Calculate bounding box once to see how small/big it is
      if (i === 0) {
        const box = new THREE.Box3().setFromObject(mtn);
        const size = new THREE.Vector3();
        box.getSize(size);
        console.log("Original mountain model size:", size);
      }

      // Uniform scale
      const scale = 300;
      mtn.scale.set(scale, scale, scale);

      // Use the user-found rotation: -17.2 degrees is perpendicular to Z (blue)
      // Since road is along Z, we add/subtract 90 degrees to face the road (X)
      const userDegrees = -17.2;
      const finalDegrees = userDegrees + 90; // Rotate to face the road
      mtn.rotation.y = finalDegrees * Math.PI / 180;

      // Initial position - spread them out along Z
      const startZ = -i * MOUNTAIN_SPACING;
      // Fixed X position for a straight line
      mtn.position.set(MOUNTAIN_X, 20, startZ);

      // Enable shadow casting
      mtn.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(mtn);

      // Store initial state for scrolling
      mountainInstances.push({
        mesh: mtn,
        startZ: startZ
      });
    }, undefined, (err) => console.error("Error loading mountain GLB:", err));
  }
}

export function updateMountains(time) {
  // Sync scrolling with road speed
  const speed = ROAD_SPEED * 0.3;

  mountainInstances.forEach(mtnObj => {
    const mtn = mtnObj.mesh;

    // Calculate raw Z based on initial offset and time
    let newZ = mtnObj.startZ + (time * speed);

    // Proper wrap-around logic for infinite scrolling
    const range = MOUNTAIN_Z_RANGE;
    const threshold = 500; // Wrap point well behind the camera

    const relativeZ = ((newZ % range) + range) % range;
    mtn.position.z = relativeZ - (range - threshold);
  });
}
