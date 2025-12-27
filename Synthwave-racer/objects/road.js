// objects/road.js
import * as THREE from 'three';
import { ROAD_LENGTH, ROAD_SPEED, ROAD_WIDTH } from '../utils/constants.js';

let roadMesh;
let uniforms;

export function createRoad(scene) {
    const visualLength = ROAD_LENGTH * 3;

    const geometry = new THREE.PlaneGeometry(
        ROAD_WIDTH,
        visualLength,
        1,
        1
    );

    uniforms = {
        time: { value: 0 }
    };

    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float time;

            void main() {
                vec2 uv = vUv;
                uv.y += time * ${ROAD_SPEED.toFixed(2)};

                vec3 color = vec3(0.04, 0.01, 0.04);

                // Center dashed line
                float center = step(0.495, uv.x) * step(uv.x, 0.505);
                float dash = step(0.6, fract(uv.y * 10.0));
                color += center * dash * vec3(1.2, 3.5, 6.0);

                // Side neon lines
                float left  = step(0.02, uv.x) * step(uv.x, 0.04);
                float right = step(0.96, uv.x) * step(uv.x, 0.98);
                color += (left + right) * vec3(1.2, 3.5, 6.0);

                gl_FragColor = vec4(color, 1.0);
            }
        `,
        transparent: false
    });

    roadMesh = new THREE.Mesh(geometry, material);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.z = -ROAD_LENGTH;
    
    scene.add(roadMesh);

    const groundGeometry = new THREE.PlaneGeometry(ROAD_WIDTH + 5, 2000);
    const groundMaterial = new THREE.ShadowMaterial({ 
        opacity: 0.5
    });
    
    const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.receiveShadow = true;
    
    scene.add(groundPlane);
}

export function updateRoad(time) {
    if (!roadMesh) return;
    const offset = (time * ROAD_SPEED) % ROAD_LENGTH;
    roadMesh.position.z = -ROAD_LENGTH + offset;
    uniforms.time.value = time;
}