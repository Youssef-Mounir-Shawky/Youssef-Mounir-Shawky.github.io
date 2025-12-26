import * as THREE from 'three';

let mountainGroup;

export function createMountains(scene) {
  mountainGroup = new THREE.Group();

  const mountainMaterial = new THREE.MeshStandardMaterial({
    color: 0x6600cc,
    emissive: 0x440088,
    emissiveIntensity: 0.8,
    flatShading: true
  });

  const mountainGeometry = new THREE.ConeGeometry(6, 18, 6);

  for (let i = 0; i < 8; i++) {
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain.position.set(-35, 0, -i * 25);  
    mountain.rotation.y = Math.PI / 4;
    mountain.scale.y = 0.8 + Math.random() * 0.8;
    mountainGroup.add(mountain);
  }

  for (let i = 0; i < 8; i++) {
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain.position.set(35, 0, -i * 25);  
    mountain.rotation.y = Math.PI / 4;
    mountain.scale.y = 0.8 + Math.random() * 0.8;
    mountainGroup.add(mountain);
  }

  scene.add(mountainGroup);
}

export function updateMountains(time) {
  if (!mountainGroup) return;

  mountainGroup.children.forEach((mountain, index) => {
    mountain.position.y = Math.sin(time * 1.2 + index) * 1.0;
  });
}