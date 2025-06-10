document.addEventListener('DOMContentLoaded', () => {
    // SLIDER FUNCTIONALITY
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;

    function showSlide(index) {
        // Ensure index is within bounds
        if (index >= totalSlides) {
            index = 0;
        } else if (index < 0) {
            index = totalSlides - 1;
        }

        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');

        currentSlideIndex = index;
    }

    // Check if slides exist before trying to show them
    if (totalSlides > 0) {
        showSlide(0); // Initialize first slide
        // Auto-advance slides every 5 seconds, only if there are slides
        setInterval(nextSlide, 5000);
    } else {
        console.warn("No slides found for the hero slider.");
    }

    function currentSlide(index) {
        showSlide(index - 1); // Adjust for 0-based indexing
    }

    function nextSlide() {
        showSlide(currentSlideIndex + 1);
    }

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => currentSlide(index + 1));
    });

    // SMOOTH SCROLLING
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                // If mobile menu is open, close it
                const navMenu = document.querySelector('.nav-menu');
                const mobileMenuToggle = document.getElementById('mobile-menu');
                if (navMenu && mobileMenuToggle && navMenu.classList.contains('active')) { // Add null checks
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // HEADER SCROLL EFFECT
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) { // Add null check
            if (window.scrollY > 100) {
                header.classList.add('scrolled'); // Add a class for scrolled state
            } else {
                header.classList.remove('scrolled');
            }

            // The CSS now handles the dark mode background based on the 'scrolled' class
            // and the 'dark-mode' class on the body.
        }
    });

    // ANIMATION ON SCROLL
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Unobserve after animation to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards and stats
    document.querySelectorAll('.service-card, .stat-item, .feature-item, .testimonial-card').forEach(el => { // Added feature-item and testimonial-card
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // COUNTER ANIMATION
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16); // Approximately 60 FPS

        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }
        updateCounter();
    }

    // Animate counters when they come into view
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target); // Use data-target attribute
                if (!isNaN(target)) { // Ensure target is a valid number
                    animateCounter(counter, target);
                }
                counterObserver.unobserve(counter); // Stop observing after animation
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the element is visible

    document.querySelectorAll('.stat-number').forEach(counter => {
        counterObserver.observe(counter);
    });

    // MOBILE MENU TOGGLE
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    // Add null checks for mobile menu elements
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Prevents scrolling when menu is open
        });
    } else {
        console.warn("Mobile menu elements not found.");
    }


    // DARK MODE TOGGLE (with icons)
    const lightModeToggle = document.getElementById('light-mode-toggle');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

    // Ensure toggles exist
    if (lightModeToggle && darkModeToggle) {
        // Function to set theme
        const setTheme = (theme) => {
            if (theme === 'dark-mode') {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        };

        // Check for user preference in localStorage or OS preference
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            setTheme(currentTheme);
        } else if (prefersDarkMode.matches) {
            setTheme('dark-mode');
        } else {
            setTheme('light-mode'); // Default to light mode if no preference
        }

        // Listen for clicks on the icons
        lightModeToggle.addEventListener('click', () => {
            setTheme('dark-mode');
        });

        darkModeToggle.addEventListener('click', () => {
            setTheme('light-mode');
        });

        // Optional: Listen for OS theme changes (only if user hasn't manually set a theme)
        prefersDarkMode.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    setTheme('dark-mode');
                } else {
                    setTheme('light-mode');
                }
            }
        });
    } else {
        console.warn("Theme toggle icons not found.");
    }
});