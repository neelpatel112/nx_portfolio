// js/contact.js
import * as THREE from 'three';
import { CONFIG } from './config.js';

export class ContactManager {
    constructor(scene, islands) {
        this.scene = scene;
        this.islands = islands;
        this.createContactElements();
    }
    
    createContactElements() {
        const contactIsland = this.islands.find(island => island.userData.section === 'contact');
        if (!contactIsland) return;
        
        const islandPos = contactIsland.position;
        
        // Create central sphere
        const sphereGeo = new THREE.SphereGeometry(0.8, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
            color: 0x4cc9f0,
            emissive: 0x4cc9f0,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9,
            wireframe: true
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        sphere.position.set(islandPos.x, islandPos.y + 1.2, islandPos.z);
        
        sphere.userData = {
            type: 'contact-sphere'
        };
        
        this.scene.add(sphere);
        
        // Create orbiting contact satellites
        const contacts = [
            { icon: '📧', text: CONFIG.content.email, color: 0xff4d6d, angle: 0 },
            { icon: '📞', text: CONFIG.content.phone, color: 0x4361ee, angle: Math.PI * 2/3 },
            { icon: '📍', text: CONFIG.content.location, color: 0x7209b7, angle: Math.PI * 4/3 }
        ];
        
        contacts.forEach((contact, index) => {
            this.createSatellite(contact, islandPos, sphere);
        });
        
        // Create floating particles around sphere
        this.createParticles(islandPos, sphere);
    }
    
    createSatellite(contact, islandPos, centerSphere) {
        const group = new THREE.Group();
        
        // Small sphere for satellite
        const sphereGeo = new THREE.SphereGeometry(0.3, 16);
        const sphereMat = new THREE.MeshStandardMaterial({
            color: contact.color,
            emissive: contact.color,
            emissiveIntensity: 0.5
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        group.add(sphere);
        
        // Orbit ring
        const ringGeo = new THREE.TorusGeometry(0.4, 0.02, 8, 24);
        const ringMat = new THREE.MeshStandardMaterial({
            color: contact.color,
            emissive: contact.color,
            transparent: true,
            opacity: 0.3
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.rotation.z = contact.angle;
        group.add(ring);
        
        // Position in orbit
        group.position.x = islandPos.x + Math.cos(contact.angle) * 1.5;
        group.position.z = islandPos.z + Math.sin(contact.angle) * 1.5;
        group.position.y = islandPos.y + 1.2;
        
        group.userData = {
            type: 'contact-satellite',
            contact: contact,
            orbitAngle: contact.angle,
            orbitRadius: 1.5,
            centerSphere: centerSphere
        };
        
        this.scene.add(group);
    }
    
    createParticles(islandPos, centerSphere) {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particleGeo = new THREE.SphereGeometry(0.05, 4);
            const particleMat = new THREE.MeshStandardMaterial({
                color: 0x4cc9f0,
                emissive: 0x4cc9f0,
                emissiveIntensity: 0.8
            });
            const particle = new THREE.Mesh(particleGeo, particleMat);
            
            // Random orbit
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 1.2;
            
            particle.position.x = islandPos.x + Math.cos(angle) * radius;
            particle.position.z = islandPos.z + Math.sin(angle) * radius;
            particle.position.y = islandPos.y + 1.2 + Math.sin(angle * 3) * 0.3;
            
            particle.userData = {
                type: 'contact-particle',
                orbitAngle: angle,
                orbitRadius: radius,
                orbitSpeed: 0.01 + Math.random() * 0.02,
                centerSphere: centerSphere
            };
            
            this.scene.add(particle);
        }
    }
    
    update() {
        // Animate satellites orbiting
        this.scene.children.forEach(child => {
            if (child.userData && child.userData.type === 'contact-satellite') {
                child.userData.orbitAngle += 0.005;
                
                child.position.x = child.userData.centerSphere.position.x + Math.cos(child.userData.orbitAngle) * child.userData.orbitRadius;
                child.position.z = child.userData.centerSphere.position.z + Math.sin(child.userData.orbitAngle) * child.userData.orbitRadius;
                
                // Make satellite face center
                child.lookAt(child.userData.centerSphere.position);
            }
            
            if (child.userData && child.userData.type === 'contact-particle') {
                child.userData.orbitAngle += child.userData.orbitSpeed;
                
                child.position.x = child.userData.centerSphere.position.x + Math.cos(child.userData.orbitAngle) * child.userData.orbitRadius;
                child.position.z = child.userData.centerSphere.position.z + Math.sin(child.userData.orbitAngle) * child.userData.orbitRadius;
                child.position.y = child.userData.centerSphere.position.y + Math.sin(child.userData.orbitAngle * 3) * 0.3;
            }
        });
    }
} 