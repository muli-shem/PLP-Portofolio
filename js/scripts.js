// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader when page is fully loaded
    window.addEventListener('load', function() {
        const loader = document.querySelector('.loader');
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 1000);
    });

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Theme switcher
    const themeSwitch = document.getElementById('themeSwitch');
    const themeIcon = themeSwitch.querySelector('i');
    
    // Check for saved theme preference or use preferred color scheme
    const isDarkMode = localStorage.getItem('darkTheme') === 'enabled' || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && 
        localStorage.getItem('darkTheme') !== 'disabled');
    
    // Set initial theme
    if (isDarkMode) {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Theme toggle event listener
    themeSwitch.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('darkTheme', 'enabled');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('darkTheme', 'disabled');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Active link highlighting based on current page
    const currentPage = window.location.pathname.split('/').pop().split('.')[0] || 'index';
    const navItems = document.querySelectorAll('.nav-link');
    
    navItems.forEach(item => {
        const dataPage = item.getAttribute('data-page');
        
        if ((currentPage === 'index' && dataPage === 'home') || 
            (currentPage === dataPage)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Page transition effect for internal links
    const internalLinks = document.querySelectorAll('a[href^="index"], a[href^="about"], a[href^="services"], a[href^="portfolio"], a[href^="resume"], a[href^="blog"], a[href^="contact"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = this.getAttribute('href');
            document.body.classList.add('page-is-changing');
            
            setTimeout(function() {
                window.location.href = target;
            }, 500);
        });
    });

    // Portfolio filtering functionality
    const filterItems = document.querySelectorAll('.filter-item');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterItems.length > 0) {
        filterItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all filter items
                filterItems.forEach(filter => filter.classList.remove('active'));
                
                // Add active class to current item
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter portfolio items
                portfolioItems.forEach(portfolio => {
                    if (filterValue === 'all' || portfolio.classList.contains(filterValue)) {
                        portfolio.style.display = 'block';
                        setTimeout(() => {
                            portfolio.style.opacity = '1';
                            portfolio.style.transform = 'scale(1)';
                        }, 200);
                    } else {
                        portfolio.style.opacity = '0';
                        portfolio.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            portfolio.style.display = 'none';
                        }, 500);
                    }
                });
            });
        });
    }
    
    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            if (name === '' || email === '' || message === '') {
                showAlert('Please fill in all required fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            // If validation passes, simulate form submission
            // In a real scenario, you would make an AJAX request here
            setTimeout(() => {
                showAlert('Your message has been sent successfully!', 'success');
                contactForm.reset();
            }, 1000);
        });
    }
    
    // Alert function for the contact form
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const contactForm = document.getElementById('contactForm');
        contactForm.parentNode.insertBefore(alertDiv, contactForm);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Initialize typed.js if element exists (for hero section)
    const typedElement = document.querySelector('.typed-text');
    
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed(typedElement, {
            strings: ['Web Developer', 'UI/UX Designer', 'Freelancer', 'Problem Solver'],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
            loop: true
        });
    }

    // Initialize lightbox for portfolio images if element exists
    const portfolioImages = document.querySelectorAll('.portfolio-img');
    
    if (portfolioImages.length > 0 && typeof SimpleLightbox !== 'undefined') {
        new SimpleLightbox('.portfolio-item a', {
            captionsData: 'alt',
            captionDelay: 250
        });
    }

    // Skills progress animation
    const progressBars = document.querySelectorAll('.progress-bar');
    
    if (progressBars.length > 0) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressValue = entry.target.getAttribute('data-progress');
                    entry.target.style.width = progressValue + '%';
                    progressObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }

    // Handle testimonial sliders if they exist
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonialSlider && typeof Swiper !== 'undefined') {
        new Swiper('.testimonial-slider', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    }

    // Handle blog post filtering if elements exist
    const blogFilters = document.querySelectorAll('.blog-filter-item');
    const blogPosts = document.querySelectorAll('.blog-card');
    
    if (blogFilters.length > 0) {
        blogFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remove active class from all filter items
                blogFilters.forEach(item => item.classList.remove('active'));
                
                // Add active class to current item
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter blog posts
                blogPosts.forEach(post => {
                    if (filterValue === 'all' || post.classList.contains(filterValue)) {
                        post.style.display = 'block';
                        setTimeout(() => {
                            post.style.opacity = '1';
                            post.style.transform = 'translateY(0)';
                        }, 200);
                    } else {
                        post.style.opacity = '0';
                        post.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            post.style.display = 'none';
                        }, 500);
                    }
                });
            });
        });
    }

    // Initialize counters animation if they exist
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        counter.textContent = Math.round(current);
                        
                        if (current < target) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
});