// js/camera.js
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraManager {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        this.setupCamera();
        this.setupControls();
    }
    
    setupCamera() {
        const { fov, near, far, initialPosition } = CONFIG.camera;
        
        this.camera = new THREE.PerspectiveCamera(
            fov,
            window.innerWidth / window.innerHeight,
            near,
            far
        );
        
        this.camera.position.set(
            initialPosition.x,
            initialPosition.y,
            initialPosition.z
        );
    }
    
    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
        this.controls.enableZoom = true;
        this.controls.zoomSpeed = 1.0;
        this.controls.enablePan = false;
        this.controls.maxPolarAngle = Math.PI / 2; // Restrict angle
        this.controls.minDistance = 5;
        this.controls.maxDistance = 20;
        this.controls.target.set(0, 1, 0);
    }
    
    update() {
        this.controls.update();
    }
    
    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
    
    moveTo(position, target, duration = 1.5) {
        // Animate with GSAP (will be called from main)
        return {
            cameraPos: position,
            targetPos: target
        };
    }
    
    getCamera() {
        return this.camera;
    }
    
    getControls() {
        return this.controls;
    }
} 