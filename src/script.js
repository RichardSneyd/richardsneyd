// Initialize audio toggle functionality
function initializeAudio() {
    const video = document.getElementById('hero-video');
    const audioToggle = document.getElementById('audio-toggle');
    const tapToListen = document.getElementById('tap-to-listen');
    
    // Make sure the overlay is visible on load
    if (tapToListen) {
        tapToListen.classList.remove('hidden');
    }
    
    // Function to update audio state and UI
    function updateAudioState(isMuted) {
        if (!video) return;
        
        video.muted = isMuted;
        const icon = audioToggle?.querySelector('i');
        
        if (icon) {
            if (isMuted) {
                icon.classList.remove('fa-volume-up');
                icon.classList.add('fa-volume-mute');
            } else {
                icon.classList.remove('fa-volume-mute');
                icon.classList.add('fa-volume-up');
            }
        }
    }
    
    // Handle first interaction
    function handleFirstInteraction() {
        // Unmute and hide tap to listen overlay
        updateAudioState(false);
        if (tapToListen) {
            tapToListen.classList.add('hidden');
        }
        
        // Remove event listeners after first interaction
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
    }
    
    if (video) {
        // Start with video muted
        updateAudioState(true);
        
        // Add event listeners for first interaction
        const interactionHandler = (e) => {
            // Don't handle if clicking on audio toggle
            if (audioToggle && audioToggle.contains(e.target)) {
                return;
            }
            handleFirstInteraction();
        };
        
        // Add with a small delay to prevent immediate triggering
        setTimeout(() => {
            document.addEventListener('click', interactionHandler);
            document.addEventListener('touchstart', interactionHandler);
        }, 100);
        
        // Handle audio toggle button
        if (audioToggle) {
            audioToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                updateAudioState(!video.muted);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio functionality
    initializeAudio();
    
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

    // Audio initialization is now handled by the initializeAudio() function at the top

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
