import * as THREE from 'three';

let mountainGroup;

export function createMountains(scene) {
  mountainGroup = new THREE.Group();

  const geometry = new THREE.ConeGeometry(6, 18, 6, 1);

  const solidMaterial = new THREE.MeshStandardMaterial({
    color: 0x120022,
    roughness: 0.8,
    metalness: 0.1,
    flatShading: true
  });

  const wireMaterial = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    emissive: 0xff00ff,
    emissiveIntensity: 1.2,
    wireframe: true
  });

  function createMountain(x, z) {
    const mountain = new THREE.Group();

    // Solid core
    const solid = new THREE.Mesh(geometry, solidMaterial);
    mountain.add(solid);

    // Glowing edges
    const wire = new THREE.Mesh(geometry, wireMaterial);
    wire.scale.multiplyScalar(1.01); 
    mountain.add(wire);

    mountain.position.set(x, 0, z);

    mountain.scale.y = 0.8 + Math.random() * 0.8;

    mountain.rotation.y = Math.random() * Math.PI;

    return mountain;
  }

  const xOffsets = [-75, -55, -35, 35, 55, 75];

  for (let x of xOffsets) {
    for (let i = 0; i < 8; i++) {
      mountainGroup.add(createMountain(x, -i * 25));
    }
  }

  scene.add(mountainGroup);
}

export function updateMountains(time) {
  if (!mountainGroup) return;

  mountainGroup.children.forEach((mountain, index) => {
    mountain.position.y = Math.sin(time * 1.2 + index) * 1.0;
  });
}
