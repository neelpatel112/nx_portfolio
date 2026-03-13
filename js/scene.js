// js/scene.js
import * as THREE from 'three';
import { CONFIG } from './config.js';

export class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.setupScene();
    }
    
    setupScene() {
        // Background color
        this.scene.background = new THREE.Color(CONFIG.scene.backgroundColor);
        
        // Fog for depth effect
        this.scene.fog = new THREE.FogExp2(
            CONFIG.scene.fogColor,
            CONFIG.scene.fogDensity
        );
    }
    
    getScene() {
        return this.scene;
    }
    
    addToScene(object) {
        this.scene.add(object);
    }
    
    removeFromScene(object) {
        this.scene.remove(object);
    }
} 