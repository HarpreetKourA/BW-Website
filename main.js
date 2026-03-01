import { injectSpeedInsights } from '@vercel/speed-insights';

const particlesConfig = {
    "particles": {
        "number": { "value": 200, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#ffffff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.6, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } },
        "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } },
        "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
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

// Initialize Speed Insights with safety
try {
    injectSpeedInsights();
} catch (e) {
    console.warn('Speed insights failed to load:', e);
}

// Modal logic - defined globally for maximum reliability across pages
window.openContactModal = function (e) {
    if (e && e.preventDefault) e.preventDefault();

    const modal = document.getElementById('contact-modal');
    if (!modal) {
        console.error('Contact modal element NOT FOUND!');
        return;
    }

    console.log('Opening contact modal...');
    modal.style.display = 'flex';

    // Initialize particles for modal if div exists
    if (typeof initParticles === 'function' && document.getElementById('particles-modal')) {
        initParticles('particles-modal');
    }

    // Smooth transition
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    });
};

window.closeContactModal = function () {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    console.log('Closing contact modal...');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Bisonworkz Main.js Initialized');

    // Initialize Footer Particles
    initParticles('particles-js');

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const icon = item.querySelector('.faq-icon');
        if (question && icon) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
                icon.textContent = item.classList.contains('active') ? '×' : '+';
            });
        }
    });

    // --- EVENT DELEGATION for Contact Triggers ---
    // This handles any element with .contact-trigger class on any page
    document.body.addEventListener('click', (e) => {
        const trigger = e.target.closest('.contact-trigger');
        if (trigger) {
            console.log('Trigger clicked via delegation:', trigger);
            window.openContactModal(e);

            // Close mobile menu if open
            const mobileOverlay = document.querySelector('.mobile-nav-overlay');
            if (mobileOverlay && mobileOverlay.classList.contains('active')) {
                mobileOverlay.classList.remove('active');
                const mobileBtn = document.querySelector('.mobile-menu-btn');
                if (mobileBtn) mobileBtn.textContent = '☰';
            }
        }
    });

    // Close on click outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('contact-modal');
        if (modal && e.target === modal) {
            window.closeContactModal();
        }
    });

    // Close button listener (if exists)
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.close-btn')) {
            window.closeContactModal();
        }
    });

    // Form Submission
    const modalForm = document.getElementById('modal-lead-form');
    if (modalForm) {
        modalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = modalForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';
            btn.disabled = true;

            const name = document.getElementById('modal-name')?.value || '';
            const email = document.getElementById('modal-email')?.value || '';
            const message = document.getElementById('modal-message')?.value || '';

            try {
                const API_KEY = 'EB1A5B77B70CD48AB21ABEDEAFAB47DE7A0DC687130B7DC04B9299CE1E8C0F147AEC1627950BA2CA4763B4300316CB2B';
                const VERIFIED_EMAIL = 'bisonworkz@gmail.com';
                const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwEHXH6UnVkbi7qKGdFMsN1BjUnbM2KdMXXKVJhPjKXF7QKZfIcySA5I38beXr8BFcQ4Q/exec';

                // 1. Send Email via Elastic Email
                const formData = new URLSearchParams();
                formData.append('apikey', API_KEY);
                formData.append('subject', `Bisonworkz Lead: ${name}`);
                formData.append('from', VERIFIED_EMAIL);
                formData.append('to', VERIFIED_EMAIL);
                formData.append('isTransactional', 'true');
                formData.append('bodyHtml', `<div style="font-family: sans-serif; padding: 20px;"><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p></div>`);

                const emailResponse = await fetch('https://api.elasticemail.com/v2/email/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData
                });

                // 2. Log to Google Sheets (GET method for reliability)
                const sheetUrl = `${GOOGLE_SHEETS_URL}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}`;
                fetch(sheetUrl, { method: 'GET', mode: 'no-cors' }).catch(err => console.error('Sheet logging failed:', err));

                alert('Thank you! Your request has been received.');
                modalForm.reset();
                window.closeContactModal();
            } catch (error) {
                console.error('Submission error:', error);
                alert('Sorry, there was an error. Please try again or email us directly.');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    if (mobileBtn && mobileNav) {
        mobileBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            mobileBtn.textContent = mobileNav.classList.contains('active') ? '×' : '☰';
        });
    }
});
