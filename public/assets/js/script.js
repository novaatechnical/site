/* ========================================
   NOVAA Group — Interactive Enhancements
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ── Contact Form Handler ──
    const form = document.getElementById('contact-form');
    if (form) {
        const status = document.getElementById('form-status');
        const submitBtn = form.querySelector('[type="submit"]');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            submitBtn.disabled = true;
            status.textContent = 'Sending message...';
            status.style.color = '#00FFFF';

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    status.textContent = 'Message sent successfully!';
                    status.style.color = 'lightgreen';
                    form.reset();
                } else {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Form submission failed');
                    });
                }
            })
            .catch(error => {
                status.textContent = `Error: ${error.message}`;
                status.style.color = '#ff5555';
                console.error('Form submission error:', error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                setTimeout(() => { status.textContent = ''; }, 5000);
            });
        });
    }


    // ── Navbar scroll effect ──
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }


    // ── Back to Top Button ──
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ── Animated Section Headers (Intersection Observer) ──
    const headerLines = document.querySelectorAll('.section-header-line');
    if (headerLines.length > 0) {
        const headerObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.5 });

        headerLines.forEach(function (line) {
            headerObserver.observe(line);
        });
    }


    // ── Stagger AOS delays for grouped items ──
    document.querySelectorAll('[data-aos-stagger]').forEach(function (parent) {
        const children = parent.querySelectorAll('[data-aos]');
        children.forEach(function (child, index) {
            child.setAttribute('data-aos-delay', (index * 150).toString());
        });
    });


    // ── Animated Counters ──
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + suffix;
            }
        }
        requestAnimationFrame(update);
    }

    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }


    // ── Active Nav Link (auto-detect current page) ──
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.offcanvas .nav-link');
    navLinks.forEach(function (link) {
        const href = (link.getAttribute('href') || '').split('/').pop();
        if (href === currentFile) {
            link.classList.add('active-page');
        }
    });

});