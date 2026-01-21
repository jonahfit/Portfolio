// Project Page JavaScript

// Mobile Navigation Toggle (reuse from main script)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Deliverable Management
class DeliverableManager {
    constructor() {
        this.deliverables = this.loadDeliverables();
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderDeliverables();
    }

    bindEvents() {
        const addBtn = document.getElementById('addDeliverableBtn');
        const modal = document.getElementById('deliverableModal');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancelBtn');
        const form = document.getElementById('deliverableForm');

        if (addBtn) {
            addBtn.addEventListener('click', () => this.openModal());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    openModal() {
        const modal = document.getElementById('deliverableModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('deliverableModal');
        const form = document.getElementById('deliverableForm');
        
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        if (form) {
            form.reset();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const deliverable = {
            id: Date.now().toString(),
            title: document.getElementById('deliverableTitle').value,
            type: document.getElementById('deliverableType').value,
            date: document.getElementById('deliverableDate').value,
            description: document.getElementById('deliverableDescription').value,
            file: document.getElementById('deliverableFile').files[0]?.name || null,
            createdAt: new Date().toISOString()
        };

        this.addDeliverable(deliverable);
        this.closeModal();
    }

    addDeliverable(deliverable) {
        this.deliverables.push(deliverable);
        this.saveDeliverables();
        this.renderDeliverables();
        this.showNotification('Deliverable added successfully!');
    }

    removeDeliverable(id) {
        this.deliverables = this.deliverables.filter(d => d.id !== id);
        this.saveDeliverables();
        this.renderDeliverables();
        this.showNotification('Deliverable removed successfully!');
    }

    renderDeliverables() {
        const grid = document.getElementById('deliverablesGrid');
        if (!grid) return;

        // Keep existing deliverables and add new ones
        const existingDeliverables = grid.querySelectorAll('.deliverable-card');
        const newDeliverables = this.deliverables.filter(d => 
            !Array.from(existingDeliverables).some(card => 
                card.dataset.deliverableId === d.id
            )
        );

        newDeliverables.forEach(deliverable => {
            const card = this.createDeliverableCard(deliverable);
            grid.appendChild(card);
        });
    }

    createDeliverableCard(deliverable) {
        const card = document.createElement('div');
        card.className = 'deliverable-card';
        card.dataset.deliverableId = deliverable.id;

        const date = new Date(deliverable.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
        });

        card.innerHTML = `
            <div class="deliverable-header">
                <h3>${deliverable.title}</h3>
                <div class="deliverable-meta">
                    <span class="deliverable-type">${deliverable.type}</span>
                    <span class="deliverable-date">${formattedDate}</span>
                </div>
            </div>
            <p>${deliverable.description}</p>
            <div class="deliverable-actions">
                <button class="btn btn-secondary btn-sm" onclick="deliverableManager.viewDeliverable('${deliverable.id}')">View</button>
                ${deliverable.file ? `<a href="#" class="btn btn-secondary btn-sm">Download</a>` : ''}
                <button class="btn btn-danger btn-sm" onclick="deliverableManager.removeDeliverable('${deliverable.id}')">Remove</button>
            </div>
        `;

        return card;
    }

    viewDeliverable(id) {
        const deliverable = this.deliverables.find(d => d.id === id);
        if (deliverable) {
            alert(`Viewing: ${deliverable.title}\n\n${deliverable.description}`);
        }
    }

    loadDeliverables() {
        const saved = localStorage.getItem('ecotrack-deliverables');
        return saved ? JSON.parse(saved) : [];
    }

    saveDeliverables() {
        localStorage.setItem('ecotrack-deliverables', JSON.stringify(this.deliverables));
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize deliverable manager when DOM is loaded
let deliverableManager;
document.addEventListener('DOMContentLoaded', () => {
    deliverableManager = new DeliverableManager();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.deliverable-card, .result-card, .process-step');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Counter animation for statistics
function animateCounter(element, target, suffix = '', duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (suffix ? ' ' + suffix : '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (suffix ? ' ' + suffix : '');
        }
    }
    
    updateCounter();
}

// Animate counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const originalText = counter.textContent;
                const target = parseInt(originalText.replace(/\D/g, ''));
                // Extract suffix (text after the number)
                const suffixMatch = originalText.match(/\d+\s*(.+)/);
                const suffix = suffixMatch ? suffixMatch[1] : '';
                if (target) {
                    animateCounter(counter, target, suffix);
                }
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe project stats
document.addEventListener('DOMContentLoaded', () => {
    const projectStats = document.querySelector('.project-stats');
    if (projectStats) {
        counterObserver.observe(projectStats);
    }
});

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .btn-danger {
        background: #ef4444;
        color: white;
        border: none;
    }
    
    .btn-danger:hover {
        background: #dc2626;
    }
`;
document.head.appendChild(style);
