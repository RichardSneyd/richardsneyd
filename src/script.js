document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const logoContainer = document.querySelector('.logo-container');
    
    if (mobileMenuBtn && navLinks) {
        console.log('Mobile menu elements found');
        
        mobileMenuBtn.addEventListener('click', (e) => {
            console.log('Hamburger button clicked');
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    } else {
        console.error('Mobile menu elements not found');
    }

    // Logo click handler
    if (logoContainer) {
        logoContainer.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Tab functionality for music catalogue
    const musicSection = document.querySelector('#music');
    const servicesSection = document.querySelector('#services');

    if (musicSection) {
        const musicTabButtons = musicSection.querySelectorAll('.tab-btn');
        const musicTabPanes = musicSection.querySelectorAll('.tab-pane');

        musicTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-tab');
                const targetPane = document.getElementById(targetId);

                // Remove active class from music section buttons and panes
                musicTabButtons.forEach(btn => btn.classList.remove('active'));
                musicTabPanes.forEach(pane => pane.classList.remove('active'));

                // Add active class to clicked button and its corresponding pane
                button.classList.add('active');
                targetPane.classList.add('active');
            });
        });
    }

    if (servicesSection) {
        const servicesTabButtons = servicesSection.querySelectorAll('.tab-btn');
        const servicesTabPanes = servicesSection.querySelectorAll('.tab-pane');

        servicesTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-tab');
                const targetPane = document.getElementById(targetId);

                // Remove active class from services section buttons and panes
                servicesTabButtons.forEach(btn => btn.classList.remove('active'));
                servicesTabPanes.forEach(pane => pane.classList.remove('active'));

                // Add active class to clicked button and its corresponding pane
                button.classList.add('active');
                targetPane.classList.add('active');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });

    // Add scroll animation for sections
    const observerOptions = {
        threshold: 0.2
    };

    // Initialize audio toggle functionality
    const video = document.getElementById('hero-video');
    const audioToggle = document.getElementById('audio-toggle');
    
    if (video && audioToggle) {
        // Ensure video starts muted
        video.muted = true;
        
        // Set initial icon state
        const icon = audioToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
        }
        
        // Add click handler
        audioToggle.addEventListener('click', function() {
            video.muted = !video.muted;
            const icon = this.querySelector('i');
            if (icon) {
                if (video.muted) {
                    icon.classList.remove('fa-volume-up');
                    icon.classList.add('fa-volume-mute');
                } else {
                    icon.classList.remove('fa-volume-mute');
                    icon.classList.add('fa-volume-up');
                }
            }
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all section elements
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll <= 0) {
                navbar.classList.remove('scrolled');
                return;
            }
            if (currentScroll > lastScroll && !navbar.classList.contains('scrolled')) {
                // Scrolling down
                navbar.classList.add('scrolled');
            } else if (currentScroll < lastScroll && navbar.classList.contains('scrolled')) {
                // Scrolling up
                navbar.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        });
    }
});
