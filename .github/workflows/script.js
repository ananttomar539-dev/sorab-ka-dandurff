/* ============================================
   SOURAV KA DANDRUFF — Interactive Engine
   3D Mouse Tracking + Scroll Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ===== LOADING SCREEN ===== */
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        triggerHeroAnimations();
    }, 2800);

    /* ===== CUSTOM CURSOR ===== */
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Dot follows immediately
        dotX += (mouseX - dotX) * 0.15;
        dotY += (mouseY - dotY) * 0.15;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';

        // Ring follows with lag
        ringX += (mouseX - ringX) * 0.08;
        ringY += (mouseY - ringY) * 0.08;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .product-image-wrap, .flavor-card, .benefit-card, .review-card, .showcase-image-wrap');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            cursorRing.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            cursorRing.classList.remove('hover');
        });
    });

    /* ===== 3D PRODUCT CONTAINER — MOUSE TRACKING (Dogstudio Style) ===== */
    const productScene = document.getElementById('productScene');
    const product3D = document.getElementById('product3D');
    const wheyContainer = document.getElementById('wheyContainer');
    const heroGlow = document.getElementById('heroGlow');

    // Track mouse position relative to scene for 3D rotation
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    // Smooth interpolation factor — lower = smoother/heavier feel (dogstudio-like)
    // 0.025 gives that premium cinematic weight
    const lerpFactor = 0.025;

    if (productScene && product3D) {
        // Mouse move — calculate rotation based on mouse position
        document.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Normalize mouse position relative to viewport center (-1 to 1)
            const normalX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 2)));
            const normalY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 2)));

            // Max rotation angles (degrees)
            const maxRotateY = 18;  // Left/right rotation
            const maxRotateX = 10;  // Up/down tilt

            targetRotateY = normalX * maxRotateY;
            targetRotateX = -normalY * maxRotateX;

            // Move the glow to follow the mouse subtly
            if (heroGlow) {
                const glowX = 50 + normalX * 15;
                const glowY = 50 + normalY * 15;
                heroGlow.style.left = glowX + '%';
                heroGlow.style.top = glowY + '%';
            }
        });

        // Smooth animation loop for 3D rotation (the key dogstudio feel)
        function animate3DContainer() {
            // Smooth lerp toward target (that premium cinematic lag)
            currentRotateX += (targetRotateX - currentRotateX) * lerpFactor;
            currentRotateY += (targetRotateY - currentRotateY) * lerpFactor;

            // Slight parallax translation for extra depth
            const translateX = currentRotateY * 0.5;
            const translateY = -currentRotateX * 0.5;

            // Apply the combined 3D transform
            product3D.style.transform = `
                rotateX(${currentRotateX}deg) 
                rotateY(${currentRotateY}deg)
                translateX(${translateX}px)
                translateY(${translateY}px)
            `;

            requestAnimationFrame(animate3DContainer);
        }
        animate3DContainer();

        // Reset rotation when mouse leaves the viewport
        document.addEventListener('mouseleave', () => {
            targetRotateX = 0;
            targetRotateY = 0;
        });
    }

    /* ===== HERO REVEAL ANIMATIONS ===== */
    function triggerHeroAnimations() {
        const heroElements = document.querySelectorAll('.hero .reveal-up, .hero .reveal-scale');
        heroElements.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, i * 200);
        });

        // Animate the product container in
        if (product3D) {
            product3D.style.opacity = '0';
            product3D.style.transform = 'scale(0.85) rotateX(15deg) translateY(40px)';
            product3D.style.transition = 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1), transform 2s cubic-bezier(0.16, 1, 0.3, 1)';

            setTimeout(() => {
                product3D.style.opacity = '1';
                product3D.style.transform = 'scale(1) rotateX(0deg) translateY(0px)';
                // After entry animation, remove the transition so mouse tracking is smooth
                setTimeout(() => {
                    product3D.style.transition = 'none';
                }, 1500);
            }, 500);
        }
    }

    /* ===== NAV SCROLL EFFECT ===== */
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    /* ===== HAMBURGER MENU ===== */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ===== SCROLL REVEAL (IntersectionObserver) ===== */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
        // Don't observe hero elements (they animate separately)
        if (!el.closest('.hero')) {
            revealObserver.observe(el);
        }
    });

    /* ===== COUNTER ANIMATIONS ===== */
    const counters = document.querySelectorAll('.counter, .stat-number[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = target * eased;
            el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    /* ===== NUTRITION RING ANIMATIONS ===== */
    const rings = document.querySelectorAll('.ring-progress');
    const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const ring = entry.target;
                const progress = parseInt(ring.getAttribute('data-progress'));
                const circumference = 339.29;
                const offset = circumference - (circumference * progress / 100);
                ring.style.strokeDashoffset = offset;
                ringObserver.unobserve(ring);
            }
        });
    }, { threshold: 0.5 });

    rings.forEach(r => ringObserver.observe(r));

    /* ===== PARALLAX ON SCROLL ===== */
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Background text parallax
        const bgText = document.querySelector('.hero-bg-text');
        if (bgText) {
            bgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.2}px))`;
        }

        // Glow follows scroll
        if (heroGlow) {
            heroGlow.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.15}px))`;
        }
    });

    /* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ===== BENEFIT CARD TILT ===== */
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ===== FLAVOR CAROUSEL DRAG ===== */
    const carousel = document.querySelector('.flavors-carousel');
    if (carousel) {
        let isDown = false, startX, scrollLeft;
        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        carousel.addEventListener('mouseleave', () => isDown = false);
        carousel.addEventListener('mouseup', () => isDown = false);
        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            carousel.scrollLeft = scrollLeft - (x - startX) * 1.5;
        });
    }

    /* ===== ACTIVE NAV LINK HIGHLIGHTING ===== */
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (navLink) {
                if (scrollPos >= top && scrollPos < top + height) {
                    document.querySelectorAll('.nav-link').forEach(l => l.style.color = '');
                    navLink.style.color = 'var(--accent)';
                }
            }
        });
    });

});
