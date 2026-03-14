// js/ui.js - UI MANAGEMENT
import { CONTENT } from './content.js';

export class UIManager {
    constructor() {
        this.init();
        this.bindEvents();
    }
    
    init() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.modals = {
            project: document.getElementById('projectModal'),
            cert: document.getElementById('certModal')
        };
        this.navDots = document.querySelectorAll('.nav-dot');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.menuBtn = document.querySelector('.menu-btn');
    }
    
    bindEvents() {
        // Navigation dots
        this.navDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const section = dot.dataset.section;
                this.navigateTo(section);
            });
        });
        
        // Desktop nav
        document.querySelectorAll('.desktop-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(link.dataset.section);
            });
        });
        
        // Mobile menu
        this.menuBtn?.addEventListener('click', () => {
            this.mobileMenu.classList.toggle('active');
        });
        
        // Mobile nav links
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(link.dataset.section);
                this.mobileMenu.classList.remove('active');
            });
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        
        // Close modals on background click
        Object.values(this.modals).forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeAllModals();
            });
        });
    }
    
    navigateTo(section) {
        // Update UI
        this.navDots.forEach(d => {
            d.classList.toggle('active', d.dataset.section === section);
        });
        
        document.querySelectorAll('.desktop-nav a').forEach(a => {
            a.classList.toggle('active', a.dataset.section === section);
        });
        
        // Dispatch event for 3D scene
        window.dispatchEvent(new CustomEvent('navigate', { detail: { section } }));
    }
    
    showProjectModal(project) {
        document.getElementById('modalTitle').textContent = project.title;
        
        const techContainer = document.getElementById('modalTech');
        techContainer.innerHTML = '';
        project.tech.forEach(tech => {
            const span = document.createElement('span');
            span.textContent = tech;
            techContainer.appendChild(span);
        });
        
        document.getElementById('modalDesc').textContent = project.description;
        document.getElementById('modalDate').textContent = project.date;
        document.getElementById('modalLive').href = project.live || '#';
        document.getElementById('modalGithub').href = project.github || '#';
        
        this.modals.project.classList.add('active');
    }
    
    showCertModal(cert) {
        document.getElementById('certTitle').textContent = cert.title;
        document.getElementById('certIssuer').textContent = cert.issuer;
        document.getElementById('certDate').textContent = cert.date;
        document.getElementById('certDesc').textContent = cert.description;
        
        this.modals.cert.classList.add('active');
    }
    
    closeAllModals() {
        Object.values(this.modals).forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    hideLoading() {
        gsap.to(this.loadingScreen, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                this.loadingScreen.style.display = 'none';
            }
        });
    }
}