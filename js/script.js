// Main event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Select all sections except footer
    const sections = document.querySelectorAll('section:not(footer)');
    const footer = document.querySelector('footer');

    // Apply scroll snap properties to each section
    sections.forEach(section => {
        section.style.scrollSnapAlign = 'start';
        section.style.scrollSnapStop = 'always';
    });

    // Apply scroll snap type to the body
    document.body.style.scrollSnapType = 'y mandatory';
    document.body.style.overflowY = 'scroll';
    document.body.style.height = '100vh';
    document.body.style.scrollBehavior = 'smooth';

    // Initially hide the footer
    footer.style.opacity = '0';
    footer.style.transform = 'translateY(100%)';
    footer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    // Function for smooth scrolling
    const smoothScroll = (target) => {
        const targetPosition = target.getBoundingClientRect().top;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        // Animation function for smooth scrolling
        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        // Easing function for smooth scrolling
        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animation);
    };

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.navbar');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle nav menu visibility when hamburger is clicked
            if (window.innerWidth <= 768) {
                if (navMenu.classList.contains('active')) {
                    navMenu.style.display = 'flex';
                    navMenu.style.flexDirection = 'column';
                    navMenu.style.position = 'absolute';
                    navMenu.style.top = '100%';
                    navMenu.style.left = '0';
                    navMenu.style.width = '100%';
                    navMenu.style.backgroundColor = 'var(--bg-color)';
                    navMenu.style.padding = '1rem';
                } else {
                    navMenu.style.display = 'none';
                }
            }
        });

        // Close menu when a nav link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                if (window.innerWidth <= 768) {
                    navMenu.style.display = 'none';
                }
            });
        });

        // Function to check window width and adjust menu visibility
        const checkWidth = () => {
            if (window.innerWidth > 768) {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'row';
                navMenu.style.position = 'static';
                navMenu.style.width = 'auto';
                navMenu.style.backgroundColor = 'transparent';
                navMenu.style.padding = '0';
                hamburger.style.display = 'none';
            } else {
                navMenu.style.display = 'none';
                hamburger.style.display = 'block';
            }
        };

        // Initial check
        checkWidth();

        // Listen for window resize
        window.addEventListener('resize', checkWidth);
    }

    // Animate footer when scrolling to contact section
    const contactSection = document.querySelector('#contact');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.style.opacity = '1';
                footer.style.transform = 'translateY(0)';
            } else {
                footer.style.opacity = '0';
                footer.style.transform = 'translateY(100%)';
            }
        });
    }, { threshold: 0.1 });

    if (contactSection) {
        observer.observe(contactSection);
    }

    // Add CSS rule for footer animation
    const style = document.createElement('style');
    style.textContent = `
        #contact:target ~ .footer {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Counter animation for about section
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        const infoBoxes = aboutSection.querySelectorAll('.info-box h5');

        // Function to animate counter
        const animateCounter = (element, target, duration, suffix) => {
            let start = 0;
            const increment = target / (duration / 16); // 60 FPS

            const updateCounter = () => {
                start += increment;
                const value = Math.floor(start);
                element.textContent = value + suffix;

                if (start < target) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target + suffix;
                }
            };

            updateCounter();
        };

        // Observe about section for counter animation
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    infoBoxes.forEach((box, index) => {
                        const target = parseInt(box.getAttribute('data-target'));
                        const suffix = index === 0 ? '+' : '%';
                        animateCounter(box, target, 2000, suffix); // 2000ms duration
                        box.classList.add('animate');
                    });
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        aboutObserver.observe(aboutSection);
    }
});

// Animate progress bars in skills section
document.addEventListener('DOMContentLoaded', function () {
    const progressBars = document.querySelectorAll('.progress');

    function animateProgressBar(bar) {
        const targetWidth = bar.style.width;
        bar.style.width = '0';

        const animate = () => {
            const currentWidth = parseFloat(bar.style.width);
            const targetWidthNum = parseFloat(targetWidth);

            if (currentWidth < targetWidthNum) {
                const newWidth = Math.min(currentWidth + 1, targetWidthNum);
                bar.style.width = newWidth + '%';
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBar(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    progressBars.forEach(bar => observer.observe(bar));
});

// Carousel functionality
document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const carouselInner = carousel.querySelector('.carousel-inner');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        const items = carousel.querySelectorAll('.carousel-item');

        let currentIndex = 0;
        const totalItems = items.length;

        function updateCarousel(smooth = true) {
            const newTransform = -currentIndex * 100 + '%';
            carouselInner.style.transition = smooth ? 'transform 0.3s ease-out' : 'none';
            carouselInner.style.transform = 'translateX(' + newTransform + ')';

            items.forEach((item, index) => {
                item.style.transition = 'all 0.3s ease-out';
                if (index === currentIndex) {
                    item.style.transform = 'scale(1) translateZ(0)';
                    item.style.opacity = '1';
                } else if (index === (currentIndex - 1 + totalItems) % totalItems) {
                    item.style.transform = 'scale(0.9) translateZ(-100px)';
                    item.style.opacity = '0.7';
                } else if (index === (currentIndex + 1) % totalItems) {
                    item.style.transform = 'scale(0.9) translateZ(-100px)';
                    item.style.opacity = '0.7';
                } else {
                    item.style.transform = 'scale(0.8) translateZ(-200px)';
                    item.style.opacity = '0.5';
                }
            });

            if (currentIndex !== 0) {
                items[0].style.transform = 'translateX(100%) scale(0.8) translateZ(-200px)';
                items[0].style.opacity = '0.5';
            }

            updateDots();
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        }

        if (nextButton && prevButton) {
            nextButton.addEventListener('click', showNext);
            prevButton.addEventListener('click', showPrev);
        }

        let autoSlide = setInterval(showNext, 5000);

        // Create and add carousel dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        items.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                clearInterval(autoSlide);
                autoSlide = setInterval(showNext, 5000);
            });
            dotsContainer.appendChild(dot);
        });
        carousel.appendChild(dotsContainer);

        function updateDots() {
            dotsContainer.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        updateCarousel(true);

        // Pause auto-slide on hover
        carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
        carousel.addEventListener('mouseleave', () => {
            autoSlide = setInterval(showNext, 5000);
        });
    }
});

// Contact form and social icons functionality
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.querySelector('.contact-form');
    const socialIcons = document.querySelectorAll('.social-icon');

    // Animate social icons on hover
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-5px) scale(1.1)';
            icon.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0) scale(1)';
            icon.style.boxShadow = 'none';
        });
    });

    // Handle contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const subject = contactForm.querySelector('input[placeholder="Subject"]').value;
            const message = contactForm.querySelector('textarea').value;

            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Send email using EmailJS
            emailjs.send("service_id", "template_id", {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_email: "meelanwangchhuk219@gmail.com"
            }).then(function (response) {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            }, function (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            });

            showNotification('Sending message...', 'info');
        });
    }

    // Function to show notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // Smooth scroll for all sections
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update copyright year
    const copyrightYear = document.querySelector('#copyright-year');
    if (copyrightYear) {
        const currentYear = new Date().getFullYear();
        copyrightYear.textContent = currentYear;
    }
});

// Add styles for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        opacity: 1;
        transition: opacity 0.5s ease;
    }
    .notification.success { background-color: #4CAF50; }
    .notification.error { background-color: #f44336; }
    .notification.info { background-color: #2196F3; }
`;
document.head.appendChild(style);

// Load EmailJS script
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
script.async = true;
document.head.appendChild(script);

script.onload = function () {
    emailjs.init("YOUR_USER_ID");
};