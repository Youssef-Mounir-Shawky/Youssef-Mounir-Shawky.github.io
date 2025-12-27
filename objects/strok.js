import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { setupStorkAudio, isLoaded } from '../audio/storkAudio.js';

export class Stork {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.mesh = null;
        this.mixer = null;
        this.listener = config.listener || null;

        // randomize
        this.speed = config.speed || 0.8 + Math.random() * 0.4;
        this.bobSpeed = 1 + Math.random();
        this.bobAmount = 0.3 + Math.random() * 0.7;
        this.jitterOffset = Math.random() * Math.PI * 2;

        this.relativePos = new THREE.Vector3(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 30
        );

        const loader = new GLTFLoader();
        const modelPath = new URL('../models/Stork.glb', import.meta.url).href;

        loader.load(modelPath, (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(0.04, 0.04, 0.04);
            this.scene.add(this.mesh);

            if (this.listener) {
                this.sound = setupStorkAudio(this.listener, this.mesh);
            }

            this.mixer = new THREE.AnimationMixer(this.mesh);
            if (gltf.animations.length > 0) {
                const action = this.mixer.clipAction(gltf.animations[0]);
                action.startAt(Math.random());
                action.play();
                action.timeScale = this.speed * 1.2;
            }
        });
    }

    update(delta, time, flockCenter, flockDirection) {
        if (this.mixer) this.mixer.update(delta);
        if (!this.mesh) return;

        if (this.sound && isLoaded) {
            const distToPlayer = Math.abs(this.mesh.position.z);

            if (distToPlayer < 60) {
                if (!this.sound.isPlaying) {
                    this.sound.play();
                }
            } else {
                if (this.sound.isPlaying) {
                    this.sound.stop();
                }
            }
        }

        const targetPos = new THREE.Vector3().copy(flockCenter).add(this.relativePos);

        targetPos.y += Math.sin(time * this.bobSpeed) * this.bobAmount;
        targetPos.x += Math.cos(time * 0.5 + this.jitterOffset) * 2;

        if (this.mesh.position.distanceTo(targetPos) > 50) {
            this.mesh.position.copy(targetPos);
        } else {
            this.mesh.position.lerp(targetPos, 0.03);
        }
        const lookTarget = new THREE.Vector3().copy(this.mesh.position).add(flockDirection);
        this.mesh.lookAt(lookTarget);

        const horizontalMovement = Math.sin(time * 0.2);
        this.mesh.rotation.z = horizontalMovement * 0.2;
    }
}
