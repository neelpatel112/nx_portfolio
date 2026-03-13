// js/lights.js
import * as THREE from 'three';
import { CONFIG } from './config.js';

export class LightingManager {
    constructor(scene) {
        this.scene = scene;
        this.setupLights();
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);
        
        // Main directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xfff5e6, 1);
        sunLight.position.set(5, 10, 7);
        sunLight.castShadow = true;
        sunLight.receiveShadow = true;
        
        // Shadow settings
        sunLight.shadow.mapSize.width = 1024;
        sunLight.shadow.mapSize.height = 1024;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.camera.left = -10;
        sunLight.shadow.camera.right = 10;
        sunLight.shadow.camera.top = 10;
        sunLight.shadow.camera.bottom = -10;
        
        this.scene.add(sunLight);
        
        // Accent lights
        const pinkLight = new THREE.PointLight(CONFIG.colors.primary, 1, 20);
        pinkLight.position.set(-3, 2, 4);
        this.scene.add(pinkLight);
        
        const blueLight = new THREE.PointLight(CONFIG.colors.secondary, 1, 20);
        blueLight.position.set(4, 1, -3);
        this.scene.add(blueLight);
        
        const purpleLight = new THREE.PointLight(CONFIG.colors.accent, 0.8, 20);
        purpleLight.position.set(-2, 3, -5);
        this.scene.add(purpleLight);
        
        // Fill lights
        const fillLight1 = new THREE.PointLight(0x446688, 0.5);
        fillLight1.position.set(2, 1, 5);
        this.scene.add(fillLight1);
        
        const fillLight2 = new THREE.PointLight(0x884466, 0.5);
        fillLight2.position.set(-2, 0.5, -5);
        this.scene.add(fillLight2);
        
        // Add small helpers for light visualization (optional)
        // this.addLightHelpers([sunLight, pinkLight, blueLight, purpleLight]);
    }
    
    addLightHelpers(lights) {
        lights.forEach(light => {
            if (light instanceof THREE.DirectionalLight) {
                const helper = new THREE.DirectionalLightHelper(light, 1);
                this.scene.add(helper);
            } else if (light instanceof THREE.PointLight) {
                const helper = new THREE.PointLightHelper(light, 0.5);
                this.scene.add(helper);
            }
        });
    }
    
    update() {
        // Animate lights if needed
        const time = Date.now() * 0.001;
        
        // Pulse accent lights
        this.scene.children.forEach(child => {
            if (child instanceof THREE.PointLight && child.intensity > 0.5) {
                child.intensity = 0.8 + Math.sin(time * 2) * 0.2;
            }
        });
    }
}