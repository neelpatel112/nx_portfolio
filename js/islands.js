// js/islands.js
import * as THREE from 'three';
import { CONFIG } from './config.js';

export class IslandManager {
    constructor(scene) {
        this.scene = scene;
        this.islands = [];
        this.createIslands();
    }
    
    createIslands() {
        // Hero Island
        const heroIsland = this.createIsland(
            CONFIG.colors.primary,
            { x: 0, y: 0, z: 0 },
            3,
            'hero'
        );
        this.islands.push(heroIsland);
        this.scene.add(heroIsland);
        
        // Skills Island
        const skillsIsland = this.createIsland(
            CONFIG.colors.secondary,
            { x: -4, y: -0.5, z: -3 },
            2.5,
            'skills'
        );
        this.islands.push(skillsIsland);
        this.scene.add(skillsIsland);
        
        // Projects Island
        const projectsIsland = this.createIsland(
            CONFIG.colors.accent,
            { x: 4, y: 0.2, z: -2.5 },
            2.8,
            'projects'
        );
        this.islands.push(projectsIsland);
        this.scene.add(projectsIsland);
        
        // Certifications Island
        const certIsland = this.createIsland(
            CONFIG.colors.highlight,
            { x: -3, y: -0.8, z: -6 },
            2.2,
            'certifications'
        );
        this.islands.push(certIsland);
        this.scene.add(certIsland);
        
        // Contact Island
        const contactIsland = this.createIsland(
            0x4cc9f0,
            { x: 3.5, y: -0.3, z: -5.5 },
            2,
            'contact'
        );
        this.islands.push(contactIsland);
        this.scene.add(contactIsland);
        
        // Add floating animations
        this.addFloatAnimation();
    }
    
    createIsland(color, position, size, type) {
        const group = new THREE.Group();
        
        // Base platform (rounded cylinder)
        const baseGeo = new THREE.CylinderGeometry(size, size * 1.2, 0.3, 32);
        const baseMat = new THREE.MeshStandardMaterial({
            color: color,
            emissive: new THREE.Color(color).multiplyScalar(0.2),
            roughness: 0.3,
            metalness: 0.2
        });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.receiveShadow = true;
        base.castShadow = true;
        base.position.y = 0;
        group.add(base);
        
        // Glow ring
        const ringGeo = new THREE.TorusGeometry(size * 1.15, 0.05, 16, 64);
        const ringMat = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            transparent: true,
            opacity: 0.4
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.05;
        group.add(ring);
        
        // Inner glow
        const innerGlowGeo = new THREE.CylinderGeometry(size * 0.8, size * 0.8, 0.05, 32);
        const innerGlowMat = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            transparent: true,
            opacity: 0.2
        });
        const innerGlow = new THREE.Mesh(innerGlowGeo, innerGlowMat);
        innerGlow.position.y = 0.1;
        group.add(innerGlow);
        
        // Add decorative pillars
        const pillarCount = 6;
        for (let i = 0; i < pillarCount; i++) {
            const angle = (i / pillarCount) * Math.PI * 2;
            const pillarGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 8);
            const pillarMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: color,
                emissiveIntensity: 0.3
            });
            const pillar = new THREE.Mesh(pillarGeo, pillarMat);
            pillar.position.x = Math.cos(angle) * (size - 0.2);
            pillar.position.z = Math.sin(angle) * (size - 0.2);
            pillar.position.y = 0.25;
            group.add(pillar);
        }
        
        group.position.set(position.x, position.y, position.z);
        group.userData = { type: 'island', section: type, floatOffset: Math.random() * Math.PI * 2 };
        
        return group;
    }
    
    addFloatAnimation() {
        // Store original positions
        this.islands.forEach(island => {
            island.userData.originalY = island.position.y;
        });
    }
    
    update(time) {
        // Make islands float gently
        this.islands.forEach(island => {
            if (island.userData.originalY !== undefined) {
                island.position.y = island.userData.originalY + 
                    Math.sin(time * 1.5 + island.userData.floatOffset) * 0.1;
                
                // Slight rotation
                island.rotation.y += 0.002;
            }
        });
    }
    
    getIslandBySection(section) {
        return this.islands.find(island => island.userData.section === section);
    }
}