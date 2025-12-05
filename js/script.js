// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Services data structure
    const services = [
        {
            name: "Thai Massage",
            emoji: "🙏",
            description: "Traditional Thai massage combining acupressure, stretching, and therapeutic techniques to promote health and wellness.",
            duration: "1 hour",
            price: "₿250",
            features: ["✓ Traditional techniques", "✓ Health benefits", "✓ Stress relief"]
        },
        {
            name: "Oil Massage",
            emoji: "🛁",
            description: "Relaxing oil massage using aromatic oils to soothe muscles and enhance relaxation.",
            duration: "1 hour",
            price: "₿400",
            features: ["✓ Aromatherapy", "✓ Muscle relaxation", "✓ Deep soothing"]
        },
        {
            name: "Foot Massage",
            emoji: "🦶",
            description: "Relaxing foot massage focusing on pressure points to improve circulation and reduce fatigue.",
            duration: "1 hour",
            price: "₿250",
            features: ["✓ Improved circulation", "✓ Fatigue relief", "✓ Relaxation"]
        },
        {
            name: "Neck, Shoulder and Back Massage",
            emoji: "💆",
            description: "Targeted massage for neck, shoulders, and back to relieve tension and improve posture.",
            duration: "1 hour",
            price: "₿250",
            features: ["✓ Tension relief", "✓ Posture improvement", "✓ Pain reduction"]
        },
    ];

    // Generate services dynamically
    const container = document.getElementById('services-container');
    if (container) {
        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <div class="service-image">
                    <div class="service-placeholder">${service.emoji} ${service.name}</div>
                </div>
                <div class="service-content">
                    <h3>${service.name}</h3>
                    <p class="service-description">${service.description}</p>
                    <div class="service-details">
                        <div class="service-duration">
                            <span class="label">Duration:</span>
                            <span class="value">${service.duration}</span>
                        </div>
                        <div class="service-price">
                            <span class="label">Price:</span>
                            <span class="value">${service.price}</span>
                        </div>
                    </div>
                    <div class="service-features">
                        ${service.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Defensive: ensure menu is closed on initial load (protect against cached state)
    if (hamburger) hamburger.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#book') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100; // Offset for navbar

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(l => l.classList.remove('active'));
                if (link) link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature, .hours-table, .about-text');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Form handling (for contact page)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const message = formData.get('message');

            // Simple validation: require name and message. Email is not used for contact.
            if (!name || !message) {
                alert('Please fill in the required fields (name and message).');
                return;
            }

            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Image lazy loading for gallery
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Lightbox functionality for gallery
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
    });

    function openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${src}" alt="${alt}">
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Close lightbox
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        function closeLightbox() {
            document.body.removeChild(lightbox);
            document.body.style.overflow = 'auto';
        }

        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    }

    // Loading animation
    window.addEventListener('load', function() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(function() {
    // Scroll-dependent functions can be added here
}, 10);

window.addEventListener('scroll', debouncedScroll);