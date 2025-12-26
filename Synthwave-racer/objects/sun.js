import * as THREE from 'three';

let sunMesh;
let lastPulseTime = 0;

export function createSun(scene) {
  const sunGeometry = new THREE.SphereGeometry(18, 64, 64);

  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xcc00ff,
    emissive: 0xcc00ff,
    emissiveIntensity: 2.5,
    transparent: true,
    opacity: 0.95
  });

  sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  sunMesh.position.set(0, 25, -80);
  
  scene.add(sunMesh);
  
  window.sunScene = scene;
}

export function updateSun(time) {
  if (!sunMesh) return;

  // Sun gentle pulsing
  const sunPulse = 1 + Math.sin(time * 0.2) * 0.05;
  sunMesh.scale.set(sunPulse, sunPulse, sunPulse);
  
  // Sun brightness pulse
  sunMesh.material.opacity = 0.9 + Math.sin(time * 0.3) * 0.1;

  if (time - lastPulseTime > 3.0) { 
    createPulse(time);
    lastPulseTime = time;
  }

  updatePulses(time);
}

function createPulse(startTime) {
  if (!window.pulses) window.pulses = [];
  
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
  pulse.userData = { startTime: startTime };
  
  window.sunScene.add(pulse);
  window.pulses.push(pulse);

  if (window.pulses.length > 4) { 
    const oldPulse = window.pulses.shift();
    window.sunScene.remove(oldPulse);
  }
}

function updatePulses(time) {
  if (!window.pulses) return;
  
  for (let i = window.pulses.length - 1; i >= 0; i--) {
    const pulse = window.pulses[i];
    const elapsed = time - pulse.userData.startTime;
    const duration = 6.0; 
    
    if (elapsed < duration) {
      const progress = elapsed / duration;
      
      
      const startSize = 18;
      const endSize = 120; // Larger end size
      const currentSize = startSize + (endSize - startSize) * progress;
      pulse.scale.set(currentSize, currentSize, currentSize);
      
      const fadeCurve = 1 - Math.pow(progress, 0.7); 
      pulse.material.opacity = 0.4 * fadeCurve; 
      
      const colorShift = 1 - progress * 0.5;
      pulse.material.color.setRGB(0.8 * colorShift, 0, 1.0 * colorShift);
    } else {
      // Remove finished pulse
      window.sunScene.remove(pulse);
      window.pulses.splice(i, 1);
    }
  }
}