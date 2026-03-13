// js/particles.js
import * as THREE from 'three';
import { CONFIG } from './config.js';

export class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.createBackgroundParticles();
        this.createFloatingParticles();
    }
    
    createBackgroundParticles() {
        const geometry = new THREE.BufferGeometry();
        const count = 2000;
        
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        for (let i = 0; i < count * 3; i += 3) {
            // Random sphere distribution
            const radius = 15 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i+2] = radius * Math.cos(phi);
            
            // Random colors (blues, purples, pinks)
            const color = new THREE.Color().setHSL(
                0.7 + Math.random() * 0.3,
                0.8,
                0.5 + Math.random() * 0.3
            );
            
            colors[i] = color.r;
            colors[i+1] = color.g;
            colors[i+2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            map: this.createParticleTexture()
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push(particles);
    }
    
    createFloatingParticles() {
        // Create small floating particles around islands
        const geometry = new THREE.BufferGeometry();
        const count = 500;
        
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count * 3; i += 3) {
            // Distribute around center
            positions[i] = (Math.random() - 0.5) * 30;
            positions[i+1] = (Math.random() - 0.5) * 20;
            positions[i+2] = (Math.random() - 0.5) * 30;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x88aaff,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push(particles);
    }
    
    createParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Draw a soft circle
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(16, 16, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 10;
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    
    update() {
        // Rotate background particles slowly
        this.particles.forEach((particleSystem, index) => {
            if (index === 0) { // Background particles
                particleSystem.rotation.y += 0.0001;
                particleSystem.rotation.x += 0.00005;
            }
        });
    }
}