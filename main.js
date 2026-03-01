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
        modalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = modalForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';
            btn.disabled = true;

            // Get form data
            const name = document.getElementById('modal-name').value;
            const email = document.getElementById('modal-email').value;
            const message = document.getElementById('modal-message').value;

            try {
                // credentials provided by the user
                const API_KEY = 'EB1A5B77B70CD48AB21ABEDEAFAB47DE7A0DC687130B7DC04B9299CE1E8C0F147AEC1627950BA2CA4763B4300316CB2B';
                const VERIFIED_FROM_EMAIL = 'bisonworkz@gmail.com';
                const RECEIVE_TO_EMAIL = 'bisonworkz@gmail.com';

                const url = 'https://api.elasticemail.com/v2/email/send';

                const params = new URLSearchParams();
                params.append('apikey', API_KEY);
                params.append('subject', `New Lead from Bisonworkz: ${name}`);
                params.append('from', VERIFIED_FROM_EMAIL);
                params.append('to', RECEIVE_TO_EMAIL);
                params.append('bodyHtml', `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #333;">New Lead from Bisonworkz</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                `);

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params
                });

                const result = await response.json();

                if (result.success) {
                    alert('Thank you! Your request has been submitted successfully.');
                    modalForm.reset();
                    if (typeof closeModal === 'function') closeModal();
                } else {
                    throw new Error(result.error || 'Failed to send lead');
                }
            } catch (error) {
                console.error('Submission Error:', error);
                alert('Oops! There was an issue sending your request. Please try again or email us directly.');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
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
