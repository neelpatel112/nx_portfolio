// js/main.js
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { SceneManager } from './scene.js';
import { CameraManager } from './camera.js';
import { LightingManager } from './lights.js';
import { ParticleSystem } from './particles.js';
import { IslandManager } from './islands.js';
import { SkillsCube } from './skills-cube.js';
import { ProjectManager } from './projects.js';
import { CertificationManager } from './certifications.js';
import { ContactManager } from './contact.js';

class Portfolio3D {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: false,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.body.appendChild(this.renderer.domElement);
        
        // Initialize managers
        this.sceneManager = new SceneManager();
        this.scene = this.sceneManager.getScene();
        
        this.cameraManager = new CameraManager(this.scene, this.renderer);
        this.camera = this.cameraManager.getCamera();
        
        this.lightingManager = new LightingManager(this.scene);
        this.particleSystem = new ParticleSystem(this.scene);
        
        // Create islands first
        this.islandManager = new IslandManager(this.scene);
        this.islands = this.islandManager.islands;
        
        // Add content to islands
        this.skillsCube = new SkillsCube(this.scene, { x: -4, y: -0.5, z: -3 });
        this.projectManager = new ProjectManager(this.scene, this.islands);
        this.certManager = new CertificationManager(this.scene, this.islands);
        this.contactManager = new ContactManager(this.scene, this.islands);
        
        // Hide loading screen after everything is loaded
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
        
        // Setup UI interactions
        this.setupUI();
    }
    
    setupUI() {
        // Navigation dots
        const navDots = document.querySelectorAll('.nav-dot');
        navDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const section = dot.dataset.section;
                this.navigateToSection(section);
            });
        });
        
        // Desktop navigation
        const navLinks = document.querySelectorAll('.desktop-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateToSection(section);
            });
        });
        
        // Mobile menu
        const menuBtn = document.querySelector('.menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
        
        // Mobile menu links
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateToSection(section);
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
            });
        });
        
        // Click on modals to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }
    
    navigateToSection(section) {
        // Update active states
        document.querySelectorAll('.nav-dot').forEach(dot => {
            dot.classList.toggle('active', dot.dataset.section === section);
        });
        
        document.querySelectorAll('.desktop-nav a').forEach(link => {
            link.classList.toggle('active', link.dataset.section === section);
        });
        
        // Move camera to section
        const targetPos = CONFIG.sections[section];
        if (!targetPos) return;
        
        // Animate camera with GSAP
        gsap.to(this.camera.position, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: CONFIG.animations.cameraMove,
            ease: "power2.inOut"
        });
        
        gsap.to(this.cameraManager.getControls().target, {
            x: targetPos.targetX || 0,
            y: targetPos.targetY || 1,
            z: targetPos.targetZ || 0,
            duration: CONFIG.animations.cameraMove,
            ease: "power2.inOut",
            onUpdate: () => {
                this.cameraManager.getControls().update();
            }
        });
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                loadingScreen.style.display = 'none';
            }
        });
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.onResize());
        
        // Raycaster for object interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        window.addEventListener('click', (event) => this.onClick(event));
        
        // Update loading progress
        this.updateLoadingProgress();
    }
    
    onClick(event) {
        // Calculate mouse position
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check intersections with interactive objects
        const interactiveObjects = [];
        
        // Add project frames
        if (this.projectManager) {
            interactiveObjects.push(...this.projectManager.projects);
        }
        
        // Add certification badges
        if (this.certManager) {
            interactiveObjects.push(...this.certManager.certs);
        }
        
        const intersects = this.raycaster.intersectObjects(interactiveObjects, true);
        
        if (intersects.length > 0) {
            const object = this.findTopParent(intersects[0].object);
            
            if (object.userData.type === 'project') {
                this.showProjectModal(object.userData.project);
            } else if (object.userData.type === 'cert') {
                this.showCertModal(object.userData.cert);
            }
        }
    }
    
    findTopParent(object) {
        while (object.parent && object.parent !== this.scene) {
            if (object.parent.userData && object.parent.userData.type) {
                return object.parent;
            }
            object = object.parent;
        }
        return object;
    }
    
    showProjectModal(project) {
        document.getElementById('modal-title').textContent = project.title;
        
        const tagsContainer = document.getElementById('modal-tags');
        tagsContainer.innerHTML = '';
        project.tech.forEach(tech => {
            const span = document.createElement('span');
            span.textContent = tech;
            tagsContainer.appendChild(span);
        });
        
        document.getElementById('modal-description').textContent = project.description;
        document.getElementById('modal-live').href = project.live;
        document.getElementById('modal-github').href = project.github;
        
        document.getElementById('project-modal').classList.add('active');
    }
    
    showCertModal(cert) {
        document.getElementById('cert-title').textContent = cert.title;
        document.getElementById('cert-issuer').textContent = cert.issuer;
        document.getElementById('cert-date').textContent = cert.date;
        document.getElementById('cert-description').textContent = cert.description;
        
        document.getElementById('cert-modal').classList.add('active');
    }
    
    updateLoadingProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            
            document.getElementById('progress-fill').style.width = progress + '%';
            document.getElementById('loading-text').textContent = `LOADING... ${Math.floor(progress)}%`;
        }, 200);
    }
    
    onResize() {
        this.cameraManager.resize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Update managers
        this.lightingManager.update();
        this.particleSystem.update();
        this.islandManager.update(time);
        this.skillsCube.update();
        
        if (this.certManager) {
            this.certManager.update();
        }
        
        if (this.contactManager) {
            this.contactManager.update();
        }
        
        this.cameraManager.update();
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio3D();
});