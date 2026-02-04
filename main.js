// FAQ Accordion Logic
import particlesConfig from './particles-config.js';

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

    // Simple Carousel Logic
    const slides = document.querySelectorAll('.team-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;

    function showSlide(index) {
        if (slides.length === 0) return;

        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (indicators[i]) indicators[i].classList.remove('active');

            if (i === index) {
                slide.classList.add('active');
                if (indicators[i]) indicators[i].classList.add('active');
            }
        });
        currentSlide = index;
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            let next = currentSlide + 1;
            if (next >= slides.length) next = 0;
            showSlide(next);
        });

        prevBtn.addEventListener('click', () => {
            let prev = currentSlide - 1;
            if (prev < 0) prev = slides.length - 1;
            showSlide(prev);
        });
    }

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
