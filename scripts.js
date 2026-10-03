document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenu.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Navbar Background Change on Scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(31, 41, 55, 0.95)';
            navbar.style.backdropFilter = 'blur(5px)';
        } else {
            navbar.style.background = '#1f2937';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    });

    // Add scroll reveal animations
    const featureCards = document.querySelectorAll('.feature-card');

    // Reveal a card and keep it visible. Without setting opacity back to 1 here,
    // the card would revert to the inline opacity:0 below once the 1s animation
    // ends and disappear.
    const revealCard = (card) => {
        if (card.dataset.revealed) return;
        card.dataset.revealed = "true";
        card.style.opacity = "1";
        card.classList.add('fade-in');
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealCard(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -10% 0px" });

        featureCards.forEach(card => {
            card.style.opacity = "0";
            observer.observe(card);
        });

        // Safety net: never leave a card hidden if the observer misses it
        // (small/odd viewports, fast scrolls, or the section already on screen).
        setTimeout(() => featureCards.forEach(revealCard), 1200);
    } else {
        // No IntersectionObserver support: just show the cards.
        featureCards.forEach(revealCard);
    }
});