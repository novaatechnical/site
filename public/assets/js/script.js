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

            // FormSubmit's AJAX endpoint answers with JSON ({ success, message }), so a
            // message only counts as sent when FormSubmit confirms it was delivered
            // to the form's address (admin@novaagroup.com).
            const endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

            fetch(endpoint, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            })
            .then(response => response.json().catch(() => ({})).then(data => {
                const delivered = response.ok && String(data.success) === 'true';
                if (!delivered) {
                    throw new Error(data.message || 'Form submission failed');
                }
                status.textContent = 'Thank you! Your message has been sent. We will get back to you soon.';
                status.style.color = 'lightgreen';
                form.reset();
                setTimeout(() => { status.textContent = ''; }, 8000);
            }))
            .catch(error => {
                // Visitors never see technical details; those go to the console only.
                // What they typed is kept so they can try again or copy it.
                console.error('Form submission error:', error);
                status.textContent = 'Sorry, we couldn’t send your message right now. ' +
                    'Please try again shortly, or email us at admin@novaagroup.com.';
                status.style.color = 'var(--marigold)';
            })
            .finally(() => {
                submitBtn.disabled = false;
            });
        });
    }


    // ── Navbar scroll effect ──
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Expose the navbar height so the hero can fill the rest of the screen
        const syncNavHeight = function () {
            document.documentElement.style.setProperty('--nav-h', navbar.offsetHeight + 'px');
        };
        syncNavHeight();
        window.addEventListener('resize', syncNavHeight, { passive: true });

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
    // Hosting uses clean URLs (/about), so compare names without ".html".
    const pageName = function (path) {
        return (path.split('/').pop() || 'index').replace(/\.html$/, '');
    };
    const currentPage = pageName(window.location.pathname);
    const navLinks = document.querySelectorAll('.offcanvas .nav-link, .offcanvas .sub-nav-link');
    navLinks.forEach(function (link) {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('#') || pageName(href) !== currentPage) return;

        link.classList.add('active-page');
        link.setAttribute('aria-current', 'page');

        // Current page is a service: show the Services list already open
        const collapse = link.closest('.collapse');
        if (collapse) {
            collapse.classList.add('show');
            const toggle = document.querySelector('[href="#' + collapse.id + '"]');
            if (toggle) {
                toggle.classList.remove('collapsed');
                toggle.setAttribute('aria-expanded', 'true');
            }
        }
    });

    // ── Sidebar marker: glides to the hovered link, rests on the current page ──
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav) {
        const marker = document.createElement('li');
        marker.className = 'sidebar-indicator';
        marker.setAttribute('aria-hidden', 'true');
        sidebarNav.appendChild(marker);

        const moveMarker = function (link) {
            if (!link) {
                marker.style.opacity = '0';
                return;
            }
            const navTop = sidebarNav.getBoundingClientRect().top;
            const box = link.getBoundingClientRect();
            marker.style.height = box.height + 'px';
            marker.style.transform = 'translateY(' + (box.top - navTop) + 'px)';
            marker.style.opacity = '1';
        };

        // Current page link, or the Services toggle while its list is closed
        const restingLink = function () {
            const active = sidebarNav.querySelector('.active-page');
            const collapse = active && active.closest('.collapse');
            if (collapse && !collapse.classList.contains('show')) {
                return sidebarNav.querySelector('[href="#' + collapse.id + '"]');
            }
            return active;
        };
        const rest = function () { moveMarker(restingLink()); };

        sidebarNav.querySelectorAll('.nav-link, .sub-nav-link').forEach(function (link) {
            link.addEventListener('mouseenter', function () { moveMarker(link); });
            link.addEventListener('focus', function () { moveMarker(link); });
        });
        sidebarNav.addEventListener('mouseleave', rest);
        sidebarNav.addEventListener('focusout', function (e) {
            if (!sidebarNav.contains(e.relatedTarget)) rest();
        });

        const sidebarPanel = sidebarNav.closest('.offcanvas');
        if (sidebarPanel) sidebarPanel.addEventListener('shown.bs.offcanvas', rest);
        sidebarNav.addEventListener('shown.bs.collapse', function () {
            if (!sidebarNav.matches(':hover')) rest();
        });
        sidebarNav.addEventListener('hidden.bs.collapse', function () {
            if (!sidebarNav.matches(':hover')) rest();
        });
    }

    // ── Org chart: draw the lines once it scrolls into view ──
    document.querySelectorAll('[data-org]').forEach(function (org) {
        if (!('IntersectionObserver' in window)) {
            org.classList.add('is-visible');
            return;
        }
        const watcher = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                org.classList.add('is-visible');
                watcher.disconnect();
            }
        }, { threshold: 0.25 });
        watcher.observe(org);
    });

    // ── Authorized Distributorship: brand tabs ──
    const brandTabs = Array.from(document.querySelectorAll('.brand-tile[role="tab"]'));
    if (brandTabs.length) {
        const selectBrand = function (tab, updateHash, scroll) {
            brandTabs.forEach(function (t) {
                const on = t === tab;
                t.setAttribute('aria-selected', on ? 'true' : 'false');
                t.tabIndex = on ? 0 : -1;
                document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
            });
            const panel = document.getElementById(tab.getAttribute('aria-controls'));
            if (updateHash) history.replaceState(null, '', '#' + panel.id);
            // Bring the products into view if they start low on the screen
            if (scroll && panel.getBoundingClientRect().top > window.innerHeight * 0.6) {
                panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        brandTabs.forEach(function (tab, i) {
            tab.addEventListener('click', function () { selectBrand(tab, true, true); });
            tab.addEventListener('keydown', function (e) {
                const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
                if (!step) return;
                e.preventDefault();
                const next = brandTabs[(i + step + brandTabs.length) % brandTabs.length];
                next.focus();
                selectBrand(next, true, false);
            });
        });

        // Open the brand named in the URL, e.g. /distributorship#brand-3
        const fromHash = brandTabs.find(function (t) {
            return '#' + t.getAttribute('aria-controls') === window.location.hash;
        });
        selectBrand(fromHash || brandTabs[0], false, Boolean(fromHash));
    }

    // ── Product photo viewer (single photo, or a gallery via data-gallery="a.png|b.png") ──
    const lightbox = document.querySelector('.product-lightbox');
    if (lightbox && typeof lightbox.showModal === 'function') {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');

        const makeButton = function (cls, label) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'lightbox-nav ' + cls;
            btn.setAttribute('aria-label', label);
            lightbox.appendChild(btn);
            return btn;
        };
        const prevBtn = makeButton('lightbox-prev', 'Previous photo');
        const nextBtn = makeButton('lightbox-next', 'Next photo');
        const counter = document.createElement('p');
        counter.className = 'lightbox-counter';
        lightbox.appendChild(counter);

        let photos = [];
        let index = 0;
        let name = '';

        const show = function (i) {
            index = (i + photos.length) % photos.length;
            lightboxImg.src = photos[index];
            lightboxImg.alt = photos.length > 1 ? name + ' (photo ' + (index + 1) + ')' : name;
            counter.textContent = photos.length > 1 ? (index + 1) + ' / ' + photos.length : '';
        };

        document.querySelectorAll('.product-card:not(.is-placeholder) img').forEach(function (img) {
            const card = img.closest('.product-card');
            img.tabIndex = 0;
            img.setAttribute('role', 'button');
            const open = function () {
                const caption = card.querySelector('figcaption');
                name = caption ? caption.textContent : img.alt;
                photos = card.dataset.gallery ? card.dataset.gallery.split('|') : [img.currentSrc || img.src];
                lightboxCaption.textContent = name;
                prevBtn.hidden = nextBtn.hidden = photos.length < 2;
                show(0);
                lightbox.showModal();
            };
            img.addEventListener('click', open);
            img.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open();
                }
            });
        });

        prevBtn.addEventListener('click', function () { show(index - 1); });
        nextBtn.addEventListener('click', function () { show(index + 1); });
        lightbox.addEventListener('keydown', function (e) {
            if (photos.length < 2) return;
            if (e.key === 'ArrowLeft') show(index - 1);
            if (e.key === 'ArrowRight') show(index + 1);
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', function () {
            lightbox.close();
        });
        // Clicking the dimmed backdrop closes it too
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) lightbox.close();
        });
    }

    // ── Particles.js Background (Hero) ──
    // Home hero (#particles-js) and inner page heroes (#particles-page)
    if (typeof particlesJS !== 'undefined') {
        ['particles-js', 'particles-page'].forEach(function (id) {
            if (!document.getElementById(id)) return;
            particlesJS(id, {
                "particles": {
                    "number": {
                        "value": 45,
                        "density": { "enable": true, "value_area": 800 }
                    },
                    "color": { "value": "#eab308" },
                    "shape": { "type": "circle" },
                    "opacity": {
                        "value": 0.45,
                        "random": true,
                        "anim": { "enable": true, "speed": 0.5, "opacity_min": 0.1, "sync": false }
                    },
                    "size": {
                        "value": 2.5,
                        "random": true,
                        "anim": { "enable": false }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#eab308",
                        "opacity": 0.15,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 0.8,
                        "direction": "none",
                        "random": true,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": { "enable": true, "mode": "grab" },
                        "onclick": { "enable": true, "mode": "push" },
                        "resize": true
                    },
                    "modes": {
                        "grab": { "distance": 150, "line_linked": { "opacity": 0.45 } },
                        "push": { "particles_nb": 2 }
                    }
                },
                "retina_detect": true
            });
        });
    }

    // ── WOW IMPACT: Scroll Progress Bar ──
    const scrollProgress = document.getElementById("scrollProgress");
    if (scrollProgress) {
        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const scrollPercent = scrollTop / (docHeight - winHeight);
            scrollProgress.style.width = Math.round(scrollPercent * 100) + "%";
        }, { passive: true });
    }

    // ── WOW IMPACT: VanillaTilt.js ──
    if (typeof VanillaTilt !== "undefined") {
        VanillaTilt.init(document.querySelectorAll(".service-card"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.02
        });
        
        VanillaTilt.init(document.querySelectorAll(".glass-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.1
        });
    }

});