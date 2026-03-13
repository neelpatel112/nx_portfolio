// js/skills-cube.js
import * as THREE from 'three';
import { CONFIG } from './config.js';

export class SkillsCube {
    constructor(scene, position) {
        this.scene = scene;
        this.position = position;
        this.group = new THREE.Group();
        this.cubeSize = 1.8;
        this.createCube();
        this.createOrbitingIcons();
        
        this.group.position.set(position.x, position.y + 1.2, position.z);
        this.scene.add(this.group);
    }
    
    createCube() {
        const faces = [
            { color: 0xff4d6d, text: 'FRONTEND', skills: CONFIG.content.skills.frontend }, // front
            { color: 0x4361ee, text: 'BACKEND', skills: CONFIG.content.skills.backend }, // back
            { color: 0x7209b7, text: 'DATABASE', skills: CONFIG.content.skills.database }, // left
            { color: 0xf9c74f, text: 'NETWORK', skills: CONFIG.content.skills.networking }, // right
            { color: 0x4cc9f0, text: 'TOOLS', skills: CONFIG.content.skills.tools }, // top
            { color: 0x9d4edd, text: 'OS', skills: CONFIG.content.skills.os } // bottom
        ];
        
        // Create outer cube frame
        const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize));
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
        this.group.add(line);
        
        // Create each face
        faces.forEach((face, index) => {
            const faceGroup = new THREE.Group();
            
            // Create panel with slight transparency
            const panelGeo = new THREE.BoxGeometry(this.cubeSize - 0.1, this.cubeSize - 0.1, 0.05);
            const panelMat = new THREE.MeshStandardMaterial({
                color: face.color,
                emissive: face.color,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            const panel = new THREE.Mesh(panelGeo, panelMat);
            panel.castShadow = true;
            panel.receiveShadow = true;
            
            // Position based on face
            switch(index) {
                case 0: // front
                    panel.position.z = this.cubeSize/2;
                    break;
                case 1: // back
                    panel.position.z = -this.cubeSize/2;
                    panel.rotation.y = Math.PI;
                    break;
                case 2: // left
                    panel.position.x = -this.cubeSize/2;
                    panel.rotation.y = -Math.PI/2;
                    break;
                case 3: // right
                    panel.position.x = this.cubeSize/2;
                    panel.rotation.y = Math.PI/2;
                    break;
                case 4: // top
                    panel.position.y = this.cubeSize/2;
                    panel.rotation.x = -Math.PI/2;
                    break;
                case 5: // bottom
                    panel.position.y = -this.cubeSize/2;
                    panel.rotation.x = Math.PI/2;
                    break;
            }
            
            faceGroup.add(panel);
            
            // Add glowing corners
            this.addCornerGlow(faceGroup, index);
            
            this.group.add(faceGroup);
        });
    }
    
    addCornerGlow(faceGroup, faceIndex) {
        // Add small glowing spheres at corners
        const positions = [
            [-1, -1], [1, -1], [1, 1], [-1, 1]
        ];
        
        positions.forEach(([x, y]) => {
            const sphereGeo = new THREE.SphereGeometry(0.08, 8);
            const sphereMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 0.5
            });
            const sphere = new THREE.Mesh(sphereGeo, sphereMat);
            
            // Position based on face
            sphere.position.x = x * this.cubeSize/2;
            sphere.position.y = y * this.cubeSize/2;
            
            faceGroup.add(sphere);
        });
    }
    
    createOrbitingIcons() {
        // Create small icons that orbit around the cube
        const iconCount = 8;
        const iconColors = [
            CONFIG.colors.primary,
            CONFIG.colors.secondary,
            CONFIG.colors.accent,
            CONFIG.colors.highlight
        ];
        
        for (let i = 0; i < iconCount; i++) {
            const sphereGeo = new THREE.SphereGeometry(0.1, 8);
            const sphereMat = new THREE.MeshStandardMaterial({
                color: iconColors[i % iconColors.length],
                emissive: iconColors[i % iconColors.length],
                emissiveIntensity: 0.8
            });
            const sphere = new THREE.Mesh(sphereGeo, sphereMat);
            sphere.castShadow = true;
            
            // Store orbit data
            sphere.userData = {
                orbitAngle: (i / iconCount) * Math.PI * 2,
                orbitRadius: 1.4,
                orbitSpeed: 0.01,
                orbitAxis: i % 3 // 0: XY, 1: XZ, 2: YZ
            };
            
            this.group.add(sphere);
        }
    }
    
    update() {
        // Rotate the cube slowly
        this.group.rotation.y += 0.005;
        this.group.rotation.x += 0.002;
        
        // Animate orbiting icons
        this.group.children.forEach(child => {
            if (child.userData && child.userData.orbitAngle !== undefined) {
                child.userData.orbitAngle += child.userData.orbitSpeed;
                
                const angle = child.userData.orbitAngle;
                const r = child.userData.orbitRadius;
                
                switch(child.userData.orbitAxis) {
                    case 0: // XY plane
                        child.position.x = Math.cos(angle) * r;
                        child.position.y = Math.sin(angle) * r;
                        child.position.z = 0;
                        break;
                    case 1: // XZ plane
                        child.position.x = Math.cos(angle) * r;
                        child.position.z = Math.sin(angle) * r;
                        child.position.y = 0;
                        break;
                    case 2: // YZ plane
                        child.position.y = Math.cos(angle) * r;
                        child.position.z = Math.sin(angle) * r;
                        child.position.x = 0;
                        break;
                }
            }
        });
    }
} 