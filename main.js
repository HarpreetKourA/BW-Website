// FAQ Accordion Logic
import particlesConfig from './particles-config.js';

// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Small delay to ensure smooth transition and minimum viewing time
        setTimeout(() => {
            preloader.classList.add('fade-out');

            // Remove from DOM after transition completes to free up memory
            setTimeout(() => {
                preloader.remove();
            }, 800); // Matches the CSS transition duration
        }, 1000); // 1 second minimum display time
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Footer Particles
    setTimeout(() => {
        if (window.particlesJS) {
            window.particlesJS('particles-js', particlesConfig);
        }
    }, 500);

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
