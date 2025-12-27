import * as THREE from 'three';

let sunMesh = null;
let sceneRef = null;
let pulses = [];
let lastPulseTime = 0;

let sunUniforms = null;

export function createSun(scene) {
    sceneRef = scene;

    const sunGeometry = new THREE.SphereGeometry(22, 64, 64);

    sunUniforms = {
        time: { value: 0 }
    };

    const sunMaterial = new THREE.ShaderMaterial({
        uniforms: sunUniforms,
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vViewDir;

            void main() {
                vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
                vNormal = normalize(normalMatrix * normal);
                vViewDir = normalize(-mvPos.xyz);
                gl_Position = projectionMatrix * mvPos;
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec3 vNormal;
            varying vec3 vViewDir;

            void main() {
                // === BASE COLOR (SOLID SUN) ===
                // Changed to a deep blue/cyan to match road
                vec3 baseColor = vec3(0.0, 0.2, 0.5); 

                // === STRONG FRESNEL (NEON EDGE) ===
                float fresnel = 1.0 - max(dot(vNormal, vViewDir), 0.0);
                fresnel = pow(fresnel, 4.0); // MUCH sharper edge

                // === NEON PULSE (ROAD-STYLE) ===
                float pulse = 0.9 + 0.1 * sin(time * 2.5);

                // === OVERDRIVEN NEON COLOR ===
                // Using the specific road neon values: vec3(1.2, 3.5, 6.0)
                vec3 neonColor = vec3(1.2, 3.5, 6.0); 

                // === COMBINE ===
                vec3 color = baseColor + neonColor * fresnel * pulse;

                gl_FragColor = vec4(color, 1.0);
            }
        `,
        transparent: false
    });

    sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    // Lowered Y to 0 (half covered) and pushed Z back to -300
    sunMesh.position.set(0, 0, -300);
    scene.add(sunMesh);
}

export function updateSun(time) {
    if (!sunMesh || !sceneRef) return;

    sunUniforms.time.value = time;

    // Subtle scale pulse (UNCHANGED)
    const pulse = 1 + Math.sin(time * 0.2) * 0.05;
    sunMesh.scale.set(pulse, pulse, pulse);

    if (time - lastPulseTime > 3.0) {
        createPulse(time);
        lastPulseTime = time;
    }

    updatePulses(time);
}

function createPulse(startTime) {
    const pulseGeometry = new THREE.SphereGeometry(1, 16, 16);
    const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff, // Changed to cyan/blue
        transparent: true,
        opacity: 0.4,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });

    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
    pulse.position.copy(sunMesh.position);
    pulse.userData = { startTime };

    sceneRef.add(pulse);
    pulses.push(pulse);

    if (pulses.length > 4) {
        const oldPulse = pulses.shift();
        sceneRef.remove(oldPulse);
    }
}

function updatePulses(time) {
    for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const elapsed = time - pulse.userData.startTime;
        const duration = 6.0;

        if (elapsed < duration) {
            const p = elapsed / duration;
            const size = 18 + (120 - 18) * p;

            pulse.scale.set(size, size, size);

            // Fade in for first 20% of life to avoid popping
            const fadeIn = Math.min(p * 5.0, 1.0);
            // Combined with original fade out curve
            pulse.material.opacity = 0.4 * fadeIn * (1.0 - Math.pow(p, 0.7));

            const c = 1.0 - p * 0.5;
            // Updated pulse color logic to fade to blue/purple
            pulse.material.color.setRGB(0.2 * c, 0.6 * c, 1.0 * c);
        } else {
            sceneRef.remove(pulse);
            pulses.splice(i, 1);
        }
    }
}
