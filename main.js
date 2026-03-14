// js/main.js - MAIN 3D ENGINE
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CONTENT } from './content.js';
import { UIManager } from './ui.js';
import { Utils } from './utils.js';

// Initialize
console.log('🚀 Starting 3D Portfolio...');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);
scene.fog = new THREE.FogExp2(0x0a0a0f, 0.02);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 3, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.enableZoom = true;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set(0, 1, 0);

// UI Manager
const ui = new UIManager();

// ========== LIGHTS ==========
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfff5e6, 1);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

const pinkLight = new THREE.PointLight(0xff4d6d, 1, 20);
pinkLight.position.set(-3, 2, 4);
scene.add(pinkLight);

const blueLight = new THREE.PointLight(0x4361ee, 1, 20);
blueLight.position.set(4, 1, -3);
scene.add(blueLight);

const purpleLight = new THREE.PointLight(0x7209b7, 0.8, 20);
purpleLight.position.set(-2, 3, -5);
scene.add(purpleLight);

// ========== PARTICLES ==========
const particleCount = 2000;
const particleGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    const r = 15 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
    particlePositions[i+1] = r * Math.sin(phi) * Math.sin(theta);
    particlePositions[i+2] = r * Math.cos(phi);
    
    const color = new THREE.Color().setHSL(0.7 + Math.random() * 0.3, 0.8, 0.5);
    particleColors[i] = color.r;
    particleColors[i+1] = color.g;
    particleColors[i+2] = color.b;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

const particleMat = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// ========== MAIN ISLAND ==========
const mainIsland = new THREE.Group();

// Base
const baseGeo = new THREE.CylinderGeometry(2.5, 3, 0.4, 32);
const baseMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a2a,
    emissive: 0x111122,
    roughness: 0.4,
    metalness: 0.3
});
const base = new THREE.Mesh(baseGeo, baseMat);
base.receiveShadow = true;
base.castShadow = true;
mainIsland.add(base);

// Glow ring
const ringGeo = new THREE.TorusGeometry(2.8, 0.1, 16, 64);
const ringMat = new THREE.MeshStandardMaterial({ 
    color: 0xff4d6d,
    emissive: 0xff4d6d,
    transparent: true,
    opacity: 0.3
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2;
ring.position.y = 0.2;
mainIsland.add(ring);

// Center crystal
const crystalGeo = new THREE.OctahedronGeometry(0.8);
const crystalMat = new THREE.MeshStandardMaterial({ 
    color: 0xff4d6d,
    emissive: 0x441122,
    roughness: 0.2,
    metalness: 0.8
});
const crystal = new THREE.Mesh(crystalGeo, crystalMat);
crystal.castShadow = true;
crystal.receiveShadow = true;
crystal.position.y = 1.2;
mainIsland.add(crystal);

scene.add(mainIsland);

// ========== FLOATING ISLANDS ==========
const islands = [
    { color: 0xff4d6d, pos: [-4, 0.5, -3], size: 1.5, name: 'skills' },
    { color: 0x4361ee, pos: [4, 0.8, -2.5], size: 1.8, name: 'projects' },
    { color: 0x7209b7, pos: [-3, 0.2, -6], size: 1.4, name: 'certs' },
    { color: 0x4cc9f0, pos: [3.5, 0.4, -5.5], size: 1.3, name: 'contact' }
];

const islandGroups = [];

islands.forEach((island, index) => {
    const group = new THREE.Group();
    
    // Base
    const geo = new THREE.CylinderGeometry(island.size, island.size * 1.2, 0.3, 16);
    const mat = new THREE.MeshStandardMaterial({ 
        color: island.color,
        emissive: new THREE.Color(island.color).multiplyScalar(0.3)
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    group.add(mesh);
    
    // Ring
    const rGeo = new THREE.TorusGeometry(island.size * 1.1, 0.05, 8, 32);
    const rMat = new THREE.MeshStandardMaterial({ 
        color: island.color,
        emissive: island.color,
        transparent: true,
        opacity: 0.4
    });
    const ring = new THREE.Mesh(rGeo, rMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.15;
    group.add(ring);
    
    group.position.set(island.pos[0], island.pos[1], island.pos[2]);
    group.userData = { type: 'island', name: island.name, color: island.color };
    
    scene.add(group);
    islandGroups.push(group);
});

// ========== PROJECT FRAMES ==========
const projectIsland = islandGroups.find(g => g.userData.name === 'projects');
if (projectIsland) {
    CONTENT.projects.forEach((project, index) => {
        const frameGroup = new THREE.Group();
        
        // Frame backing
        const backGeo = new THREE.BoxGeometry(1.4, 1.2, 0.1);
        const backMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const back = new THREE.Mesh(backGeo, backMat);
        back.castShadow = true;
        back.receiveShadow = true;
        frameGroup.add(back);
        
        // Frame border
        const borderGeo = new THREE.BoxGeometry(1.6, 1.4, 0.1);
        const borderMat = new THREE.MeshStandardMaterial({ 
            color: project.color,
            emissive: project.color,
            emissiveIntensity: 0.3
        });
        const border = new THREE.Mesh(borderGeo, borderMat);
        border.castShadow = true;
        frameGroup.add(border);
        
        // Screen
        const screenGeo = new THREE.BoxGeometry(1.2, 1.0, 0.05);
        const screenMat = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            emissive: new THREE.Color(project.color).multiplyScalar(0.2)
        });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.z = 0.1;
        frameGroup.add(screen);
        
        // Position around island
        const angle = (index / CONTENT.projects.length) * Math.PI * 2 - Math.PI/2;
        const radius = 2.2;
        frameGroup.position.set(
            projectIsland.position.x + Math.cos(angle) * radius,
            projectIsland.position.y + 1.0,
            projectIsland.position.z + Math.sin(angle) * radius
        );
        
        // Look at center
        frameGroup.lookAt(projectIsland.position.x, frameGroup.position.y, projectIsland.position.z);
        
        frameGroup.userData = { 
            type: 'project', 
            project: project,
            id: project.id
        };
        
        scene.add(frameGroup);
    });
}

// ========== SKILLS CUBE ==========
const skillsIsland = islandGroups.find(g => g.userData.name === 'skills');
if (skillsIsland) {
    const cubeGroup = new THREE.Group();
    const size = 1.2;
    
    // Create cube faces
    const skillsCategories = Object.entries(CONTENT.skills);
    skillsCategories.forEach(([category, skills], index) => {
        const colors = [0xff4d6d, 0x4361ee, 0x7209b7, 0xf9c74f, 0x4cc9f0, 0x9d4edd];
        
        const faceGeo = new THREE.BoxGeometry(size, size, 0.1);
        const faceMat = new THREE.MeshStandardMaterial({ 
            color: colors[index % colors.length],
            emissive: colors[index % colors.length],
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.8
        });
        const face = new THREE.Mesh(faceGeo, faceMat);
        face.castShadow = true;
        
        switch(index) {
            case 0: face.position.z = size/2; break; // front
            case 1: face.position.z = -size/2; face.rotation.y = Math.PI; break; // back
            case 2: face.position.x = -size/2; face.rotation.y = -Math.PI/2; break; // left
            case 3: face.position.x = size/2; face.rotation.y = Math.PI/2; break; // right
            case 4: face.position.y = size/2; face.rotation.x = -Math.PI/2; break; // top
            case 5: face.position.y = -size/2; face.rotation.x = Math.PI/2; break; // bottom
        }
        
        cubeGroup.add(face);
    });
    
    cubeGroup.position.set(
        skillsIsland.position.x,
        skillsIsland.position.y + 1.2,
        skillsIsland.position.z
    );
    
    cubeGroup.userData = { type: 'skills-cube' };
    scene.add(cubeGroup);
}

// ========== CERTIFICATION BADGES ==========
const certIsland = islandGroups.find(g => g.userData.name === 'certs');
if (certIsland) {
    CONTENT.certifications.forEach((cert, index) => {
        const badgeGroup = new THREE.Group();
        
        // Hexagon
        const hexGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 6);
        const hexMat = new THREE.MeshStandardMaterial({ 
            color: cert.color,
            emissive: cert.color,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.8
        });
        const hex = new THREE.Mesh(hexGeo, hexMat);
        hex.rotation.y = Math.PI / 6;
        badgeGroup.add(hex);
        
        // Ring
        const ringGeo = new THREE.TorusGeometry(0.45, 0.02, 8, 24);
        const ringMat = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: cert.color,
            transparent: true,
            opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.z = 0.06;
        badgeGroup.add(ring);
        
        // Position around island
        const angle = (index / CONTENT.certifications.length) * Math.PI * 2;
        const radius = 1.8;
        badgeGroup.position.set(
            certIsland.position.x + Math.cos(angle) * radius,
            certIsland.position.y + 1.2 + Math.sin(angle * 2) * 0.2,
            certIsland.position.z + Math.sin(angle) * radius
        );
        
        badgeGroup.userData = { 
            type: 'cert', 
            cert: cert,
            id: cert.id
        };
        
        scene.add(badgeGroup);
    });
}

// ========== CONTACT SPHERE ==========
const contactIsland = islandGroups.find(g => g.userData.name === 'contact');
if (contactIsland) {
    const sphereGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({ 
        color: 0x4cc9f0,
        emissive: 0x4cc9f0,
        emissiveIntensity: 0.2,
        wireframe: true
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(
        contactIsland.position.x,
        contactIsland.position.y + 1.2,
        contactIsland.position.z
    );
    scene.add(sphere);
}

// ========== RAYCASTER FOR INTERACTIONS ==========
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    const interactiveObjects = [];
    scene.traverse(obj => {
        if (obj.userData && (obj.userData.type === 'project' || obj.userData.type === 'cert')) {
            interactiveObjects.push(obj);
        }
    });
    
    const intersects = raycaster.intersectObjects(interactiveObjects);
    
    if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData.type === 'project') {
            ui.showProjectModal(obj.userData.project);
        } else if (obj.userData.type === 'cert') {
            ui.showCertModal(obj.userData.cert);
        }
    }
});

// ========== NAVIGATION ==========
window.addEventListener('navigate', (e) => {
    const section = e.detail.section;
    const targetPos = {
        hero: { x: 0, y: 1, z: 12, target: [0, 1, 0] },
        skills: { x: -4, y: 1.5, z: 8, target: [-2, 1, 0] },
        projects: { x: 4, y: 1.5, z: 8, target: [2, 1, 0] },
        certs: { x: -3, y: 1.5, z: 10, target: [-1.5, 1, -2] },
        contact: { x: 3, y: 1.5, z: 10, target: [1.5, 1, -1.5] }
    }[section] || { x: 0, y: 1, z: 12, target: [0, 1, 0] };
    
    controls.autoRotate = false;
    
    gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.5,
        ease: "power2.inOut"
    });
    
    gsap.to(controls.target, {
        x: targetPos.target[0],
        y: targetPos.target[1],
        z: targetPos.target[2],
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => controls.update(),
        onComplete: () => {
            setTimeout(() => { controls.autoRotate = true; }, 3000);
        }
    });
});

// ========== HIDE LOADING ==========
setTimeout(() => ui.hideLoading(), 2000);

// ========== ANIMATION LOOP ==========
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate crystal
    crystal.rotation.y += 0.01;
    crystal.rotation.x += 0.005;
    
    // Float islands
    islandGroups.forEach((island, i) => {
        island.position.y = island.userData.originalY || island.position.y;
        if (!island.userData.originalY) {
            island.userData.originalY = island.position.y;
        }
        island.position.y = island.userData.originalY + Math.sin(Date.now() * 0.002 + i) * 0.2;
    });
    
    // Rotate particles
    particles.rotation.y += 0.0002;
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

// ========== RESIZE ==========
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('✅ 3D Portfolio Ready!'); 