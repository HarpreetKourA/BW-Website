import { injectSpeedInsights } from '@vercel/speed-insights';

const particlesConfig = {
    "particles": {
        "number": { "value": 160, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#ffffff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.4, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } },
        "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } },
        "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.2, "width": 1 },
        "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": { "enable": true, "mode": "grab" },
            "onclick": { "enable": true, "mode": "push" },
            "resize": true
        },
        "modes": {
            "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
            "push": { "particles_nb": 4 }
        }
    },
    "retina_detect": true
};

// Particles initialization helper
function initParticles(id) {
    if (typeof window.particlesJS !== 'undefined' && document.getElementById(id)) {
        window.particlesJS(id, particlesConfig);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Vercel Speed Insights
    injectSpeedInsights();

    // Initialize Footer Particles
    initParticles('particles-js');

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const icon = item.querySelector('.faq-icon');

        question.addEventListener('click', () => {
            // Toggle current
            item.classList.toggle('active');

            // Update Icon
            if (item.classList.contains('active')) {
                icon.textContent = '×'; // Multiply symbol or 'x'
            } else {
                icon.textContent = '+';
            }
        });
    });


    // Modal Logic
    const modal = document.getElementById('contact-modal');
    const triggers = document.querySelectorAll('.contact-trigger');
    const closeBtn = document.querySelector('.close-btn');
    const btnSecondary = document.querySelector('header .btn-secondary'); // Header contact button

    // Add trigger class to header button if not present via HTML
    if (btnSecondary && !btnSecondary.classList.contains('contact-trigger')) {
        btnSecondary.classList.add('contact-trigger');
    }

    // Open Modal
    function openModal(e) {
        e.preventDefault();
        modal.style.display = 'flex';
        // Initialize particles when modal is visible
        initParticles('particles-modal');
        // Small delay to allow display flex to apply before opacity transition
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    // Close Modal
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Match CSS transition
    }

    // Add event listeners to all triggers
    // We re-query in case we added the class dynamically
    document.querySelectorAll('.contact-trigger').forEach(trigger => {
        trigger.addEventListener('click', openModal);
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Form Submission (Mock)
    const modalForm = document.getElementById('modal-lead-form');
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = modalForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Thank you! Your request has been submitted.');
                btn.textContent = originalText;
                btn.disabled = false;
                modalForm.reset();
                closeModal();
            }, 1000);
        });
    }

    // Mobile Menu Logic
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-overlay a');

    if (mobileBtn && mobileNav) {
        mobileBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            mobileBtn.textContent = mobileNav.classList.contains('active') ? '×' : '☰';
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileBtn.textContent = '☰';
            });
        });
    }
});
