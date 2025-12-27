import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Stork {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.mesh = null;
        this.mixer = null;

        // Randomization for realism
        this.speed = config.speed || 0.8 + Math.random() * 0.4;
        this.bobSpeed = 1 + Math.random();
        this.bobAmount = 0.5 + Math.random() * 0.5;
        this.jitterOffset = Math.random() * Math.PI * 2;

        // Target relative offset from flock center
        this.relativePos = new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 20
        );

        const loader = new GLTFLoader();
        const modelPath = new URL('../models/Stork.glb', import.meta.url).href;

        loader.load(modelPath, (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(0.05, 0.05, 0.05);
            this.scene.add(this.mesh);

            this.mixer = new THREE.AnimationMixer(this.mesh);
            if (gltf.animations.length > 0) {
                const action = this.mixer.clipAction(gltf.animations[0]);
                action.startAt(Math.random());
                action.play();
                action.timeScale = this.speed * 1.5;
            }
        });
    }

    update(delta, time, flockCenter, flockDirection) {
        if (this.mixer) this.mixer.update(delta);
        if (!this.mesh) return;

        // Realistic Jitter (Sinusoidal movement relative to flock center)
        const jitter = Math.sin(time * 2 + this.jitterOffset) * 2;

        // Target Position = Flock Center + Our Relative Slot + Vertical Bobbing
        const targetPos = new THREE.Vector3().copy(flockCenter).add(this.relativePos);
        targetPos.y += Math.sin(time * this.bobSpeed) * this.bobAmount + jitter * 0.5;
        targetPos.x += Math.cos(time * 0.5 + this.jitterOffset) * 2;

        // Smoothly interpolate towards target
        this.mesh.position.lerp(targetPos, 0.05);

        // Rotation: Face the flock's movement direction with a bit of "banking"
        const lookTarget = new THREE.Vector3().copy(this.mesh.position).add(flockDirection);
        this.mesh.lookAt(lookTarget);
    }
}
