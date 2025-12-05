// Small utility to build elements from HTML strings
function createFragment(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

async function loadSiteData() {
  const response = await fetch(window.location.origin + "/js/data.json");
  if (!response.ok) throw new Error("Unable to load site data");
  return response.json();
}

function populateNavigation(data, currentPage) {
  const brandTitleEl = document.getElementById("brand-title");
  if (brandTitleEl) brandTitleEl.textContent = data.brand.name;

  const navMenu = document.getElementById("nav-menu");
  if (!navMenu) return;
  navMenu.innerHTML = "";

  data.navigation.forEach((item) => {
    const li = document.createElement("li");
    li.className = "nav-item";

    const isAnchor = item.href.startsWith("#");
    const href =
      isAnchor && currentPage !== "home" ? `index.html${item.href}` : item.href;
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.textContent = item.label;
    anchor.className = "nav-link";

    if (item.page && item.page === currentPage) anchor.classList.add("active");
    if (item.variant === "button") anchor.classList.add("book-now-btn");

    li.appendChild(anchor);
    navMenu.appendChild(li);
  });
}

function populateFooter(data) {
  const brand = data.brand;
  const footerBrand = document.getElementById("footer-brand-name");
  const footerDesc = document.getElementById("footer-description");
  const footerSocial = document.getElementById("footer-social");
  const footerAddr = document.getElementById("footer-address");
  const footerPhone = document.getElementById("footer-phone");
  const footerLinks = document.getElementById("footer-links");
  const footerCopy = document.getElementById("footer-copy");

  if (footerBrand) footerBrand.textContent = brand.name;
  if (footerDesc) footerDesc.textContent = brand.description;
  if (footerSocial) {
    footerSocial.innerHTML = "";
    brand.social.forEach((s) => {
      footerSocial.appendChild(
        createFragment(
          `<a href="${s.url}" class="social-link" aria-label="${s.platform}">${s.icon}</a>`
        )
      );
    });
  }
  if (footerAddr) footerAddr.innerHTML = `📍 ${brand.address.join("<br>")}`;
  if (footerPhone)
    footerPhone.innerHTML = `📞 <a href="tel:${brand.phone}">${brand.phone}</a>`;
  if (footerLinks) {
    footerLinks.innerHTML = "";
    data.navigation
      .filter((n) => !n.variant)
      .forEach((n) => {
        footerLinks.appendChild(
          createFragment(`<li><a href="${n.href}">${n.label}</a></li>`)
        );
      });
  }
  if (footerCopy)
    footerCopy.innerHTML = `&copy; ${brand.year} ${brand.name}. All rights reserved.`;
}

function populateHome(data) {
  const hero = data.homePage.hero;
  const about = data.homePage.about;
  const hours = data.homePage.hours;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("home-hero-title", hero.title);
  setText("home-hero-subtitle", hero.subtitle);
  setText("home-hero-description", hero.description);

  const heroButtons = document.getElementById("home-hero-buttons");
  if (heroButtons) {
    heroButtons.innerHTML = "";
    hero.buttons.forEach((btn) => {
      const anchor = document.createElement("a");
      anchor.href = btn.href;
      anchor.className = `btn btn-${btn.variant}`;
      anchor.textContent = btn.label;
      heroButtons.appendChild(anchor);
    });
  }

  setText("home-about-title", about.title);
  const aboutText = document.getElementById("home-about-text");
  if (aboutText) {
    aboutText.innerHTML = "";
    about.paragraphs.forEach((p) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = p;
      aboutText.appendChild(paragraph);
    });
  }

  const aboutFeatures = document.getElementById("home-about-features");
  if (aboutFeatures) {
    aboutFeatures.innerHTML = "";
    about.features.forEach((feature) => {
      const featureEl = createFragment(`
                <div class="feature">
                    <div class="feature-icon">${feature.icon}</div>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `);
      aboutFeatures.appendChild(featureEl);
    });
  }

  setText("home-hours-title", hours.title);
  const hoursTable = document.getElementById("home-hours-table");
  if (hoursTable) {
    hoursTable.innerHTML = "";
    hours.rows.forEach((row) => {
      hoursTable.appendChild(
        createFragment(`
                <div class="hours-row">
                    <span class="day">${row.day}</span>
                    <span class="time">${row.time}</span>
                </div>
            `)
      );
    });
  }
  const hoursNote = document.getElementById("home-hours-note");
  if (hoursNote) hoursNote.innerHTML = `<p>${hours.note}</p>`;
}

function populateServicesPage(data) {
  const servicesData = data.servicesPage;
  const servicesContainer = document.getElementById("services-container");
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("services-hero-title", servicesData.hero.title);
  setText("services-hero-subtitle", servicesData.hero.subtitle);

  if (servicesContainer) {
    servicesContainer.innerHTML = "";
    servicesData.services.forEach((service) => {
      const featureTags = service.features
        .map((f) => `<span class="feature-tag">${f}</span>`)
        .join("");
      servicesContainer.appendChild(
        createFragment(`
                <div class="service-card">
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
                        <div class="service-features">${featureTags}</div>
                    </div>
                </div>
            `)
      );
    });
  }

  setText("services-cta-title", servicesData.cta.title);
  setText("services-cta-description", servicesData.cta.description);
  const ctaButtons = document.getElementById("services-cta-buttons");
  if (ctaButtons) {
    ctaButtons.innerHTML = "";
    servicesData.cta.buttons.forEach((btn) => {
      ctaButtons.appendChild(
        createFragment(
          `<a href="${btn.href}" class="btn btn-${btn.variant}">${btn.label}</a>`
        )
      );
    });
  }
}

function populateContactPage(data) {
  const contactData = data.contactPage;
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("contact-hero-title", contactData.hero.title);
  setText("contact-hero-subtitle", contactData.hero.subtitle);

  setText("contact-info-heading", contactData.infoHeading);
  setText("contact-location-title", contactData.contactDetails.locationTitle);
  const addressEl = document.getElementById("contact-address");
  if (addressEl)
    addressEl.innerHTML = contactData.contactDetails.addressLines.join("<br>");

  setText("contact-phone-title", contactData.contactDetails.phoneTitle);
  const phoneLink = document.getElementById("contact-phone-link");
  if (phoneLink) {
    phoneLink.href = `tel:${data.brand.phone}`;
    phoneLink.textContent = data.brand.phone;
  }
  setText("contact-phone-note", contactData.contactDetails.phoneNote);

  setText("contact-hours-title", contactData.contactDetails.hoursTitle);
  setText("contact-hours-text", contactData.contactDetails.hoursText);

  setText("contact-social-title", contactData.contactDetails.socialTitle);
  setText("contact-social-note", contactData.contactDetails.socialNote);
  const socialLinks = document.getElementById("contact-social-links");
  if (socialLinks) {
    socialLinks.innerHTML = "";
    data.brand.social.forEach((s) => {
      socialLinks.appendChild(
        createFragment(
          `<a href="${s.url}" class="social-link" aria-label="${s.platform}">${s.icon}</a>`
        )
      );
    });
  }

  const mapLabel = document.getElementById("map-label");
  const mapNote = document.getElementById("map-note");
  if (mapLabel) mapLabel.innerHTML = contactData.map.label;
  if (mapNote) mapNote.textContent = contactData.map.note;

  setText("booking-info-title", contactData.bookingTitle);
  const bookingGrid = document.getElementById("booking-grid");
  if (bookingGrid) {
    bookingGrid.innerHTML = "";
    contactData.bookingInfo.forEach((card) => {
      bookingGrid.appendChild(
        createFragment(`
                <div class="booking-card">
                    <div class="booking-icon">${card.icon}</div>
                    <h3>${card.title}</h3>
                    <p>${card.description}</p>
                </div>
            `)
      );
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await loadSiteData();
    const currentPage = document.body.getAttribute("data-page") || "home";

    populateNavigation(data, currentPage);
    populateFooter(data);

    if (currentPage === "home") {
      populateHome(data);
      populateServicesPage(data);
      populateContactPage(data);
    }
  } catch (error) {
    console.error(error);
  }

  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Defensive: ensure menu is closed on initial load (protect against cached state)
  if (hamburger) hamburger.classList.remove("active");
  if (navMenu) navMenu.classList.remove("active");

  // Toggle mobile menu
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && href !== "#book") {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Navbar scroll effect
  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add/remove scrolled class for styling
    if (scrollTop > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScrollTop = scrollTop;
  });

  // Active navigation link highlighting
  const sections = document.querySelectorAll("section[id]");

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 100; // Offset for navbar

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute("id");
      const link = document.querySelector(`.nav-link[href="#${id}"]`);

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach((l) => l.classList.remove("active"));
        if (link) link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavLink);

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".feature, .hours-table, .about-text"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Image lazy loading
  const lazyImages = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));

  // Loading animation
  window.addEventListener("load", function () {
    const loader = document.querySelector(".loader");
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
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
const debouncedScroll = debounce(function () {
  // Scroll-dependent functions can be added here
}, 10);

window.addEventListener("scroll", debouncedScroll);
