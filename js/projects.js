// js/projects.js
import * as THREE from 'three';
import { CONFIG } from './config.js';

export class ProjectManager {
    constructor(scene, islands) {
        this.scene = scene;
        this.islands = islands;
        this.projects = [];
        this.createProjectFrames();
    }
    
    createProjectFrames() {
        const projectsIsland = this.islands.find(island => island.userData.section === 'projects');
        if (!projectsIsland) return;
        
        const islandPos = projectsIsland.position;
        const projects = CONFIG.content.projects;
        
        projects.forEach((project, index) => {
            const frame = this.createFrame(project, index);
            
            // Position around the island
            const angle = (index / projects.length) * Math.PI * 2 - Math.PI/2;
            const radius = 1.8;
            
            frame.position.x = islandPos.x + Math.cos(angle) * radius;
            frame.position.z = islandPos.z + Math.sin(angle) * radius;
            frame.position.y = islandPos.y + 1.2;
            
            // Rotate to face outward
            frame.lookAt(
                frame.position.x + Math.cos(angle),
                frame.position.y,
                frame.position.z + Math.sin(angle)
            );
            
            frame.userData = {
                type: 'project',
                projectId: project.id,
                project: project
            };
            
            this.scene.add(frame);
            this.projects.push(frame);
        });
    }
    
    createFrame(project) {
        const group = new THREE.Group();
        
        // Frame backing
        const backGeo = new THREE.BoxGeometry(1.6, 1.4, 0.15);
        const backMat = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            roughness: 0.3,
            metalness: 0.7
        });
        const back = new THREE.Mesh(backGeo, backMat);
        back.castShadow = true;
        back.receiveShadow = true;
        back.position.z = -0.05;
        group.add(back);
        
        // Frame border
        const borderGeo = new THREE.BoxGeometry(1.8, 1.6, 0.1);
        const borderMat = new THREE.MeshStandardMaterial({
            color: project.color,
            emissive: project.color,
            emissiveIntensity: 0.3
        });
        const border = new THREE.Mesh(borderGeo, borderMat);
        border.castShadow = true;
        border.receiveShadow = true;
        group.add(border);
        
        // Screen (where content goes)
        const screenGeo = new THREE.BoxGeometry(1.4, 1.2, 0.05);
        const screenMat = new THREE.MeshStandardMaterial({
            color: 0x000000,
            emissive: new THREE.Color(project.color).multiplyScalar(0.2)
        });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.castShadow = true;
        screen.receiveShadow = true;
        screen.position.z = 0.05;
        group.add(screen);
        
        // Add glowing corners
        this.addGlowCorners(group, project.color);
        
        return group;
    }
    
    addGlowCorners(group, color) {
        const positions = [
            [-0.85, 0.75, 0.1],
            [0.85, 0.75, 0.1],
            [0.85, -0.75, 0.1],
            [-0.85, -0.75, 0.1]
        ];
        
        positions.forEach(pos => {
            const sphereGeo = new THREE.SphereGeometry(0.05, 8);
            const sphereMat = new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.8
            });
            const sphere = new THREE.Mesh(sphereGeo, sphereMat);
            sphere.position.set(pos[0], pos[1], pos[2]);
            group.add(sphere);
        });
    }
    
    highlightProject(projectId) {
        this.projects.forEach(frame => {
            if (frame.userData.projectId === projectId) {
                // Highlight this frame
                gsap.to(frame.scale, {
                    x: 1.1,
                    y: 1.1,
                    z: 1.1,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    }
} 