// js/certifications.js
import * as THREE from 'three';
import { CONFIG } from './config.js';

export class CertificationManager {
    constructor(scene, islands) {
        this.scene = scene;
        this.islands = islands;
        this.certs = [];
        this.createCertBadges();
    }
    
    createCertBadges() {
        const certIsland = this.islands.find(island => island.userData.section === 'certifications');
        if (!certIsland) return;
        
        const islandPos = certIsland.position;
        const certs = CONFIG.content.certifications;
        
        certs.forEach((cert, index) => {
            const badge = this.createBadge(cert, index);
            
            // Position above island in a circle
            const angle = (index / certs.length) * Math.PI * 2;
            const radius = 1.5;
            
            badge.position.x = islandPos.x + Math.cos(angle) * radius;
            badge.position.z = islandPos.z + Math.sin(angle) * radius;
            badge.position.y = islandPos.y + 1.5 + Math.sin(angle * 2) * 0.3;
            
            // Look at center
            badge.lookAt(islandPos.x, badge.position.y, islandPos.z);
            
            badge.userData = {
                type: 'cert',
                certId: cert.id,
                cert: cert
            };
            
            this.scene.add(badge);
            this.certs.push(badge);
        });
    }
    
    createBadge(cert, index) {
        const group = new THREE.Group();
        
        // Main hexagonal shape
        const shapeGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.1, 6);
        const shapeMat = new THREE.MeshStandardMaterial({
            color: cert.color,
            emissive: cert.color,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        const hex = new THREE.Mesh(shapeGeo, shapeMat);
        hex.castShadow = true;
        hex.receiveShadow = true;
        hex.rotation.y = Math.PI / 6;
        group.add(hex);
        
        // Inner glow ring
        const ringGeo = new THREE.TorusGeometry(0.5, 0.02, 16, 32);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: cert.color,
            transparent: true,
            opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.z = 0.06;
        group.add(ring);
        
        // Outer ring
        const outerRingGeo = new THREE.TorusGeometry(0.65, 0.01, 16, 32);
        const outerRingMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
        outerRing.rotation.x = Math.PI / 2;
        outerRing.position.z = 0.03;
        group.add(outerRing);
        
        // Small floating particles around badge
        for (let i = 0; i < 6; i++) {
            const particleAngle = (i / 6) * Math.PI * 2;
            const particleGeo = new THREE.SphereGeometry(0.03, 4);
            const particleMat = new THREE.MeshStandardMaterial({
                color: cert.color,
                emissive: cert.color
            });
            const particle = new THREE.Mesh(particleGeo, particleMat);
            
            particle.position.x = Math.cos(particleAngle) * 0.9;
            particle.position.z = Math.sin(particleAngle) * 0.9;
            particle.position.y = 0;
            
            particle.userData = {
                floatAngle: particleAngle,
                floatSpeed: 0.02
            };
            
            group.add(particle);
        }
        
        return group;
    }
    
    update() {
        // Animate certificates (float and rotate)
        this.certs.forEach(cert => {
            cert.rotation.y += 0.01;
            
            // Animate particles
            cert.children.forEach(child => {
                if (child.userData && child.userData.floatAngle !== undefined) {
                    child.userData.floatAngle += child.userData.floatSpeed;
                    child.position.x = Math.cos(child.userData.floatAngle) * 0.9;
                    child.position.z = Math.sin(child.userData.floatAngle) * 0.9;
                }
            });
        });
    }
} 