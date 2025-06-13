// Initialize audio toggle functionality
function initializeAudio() {
    const video = document.getElementById('hero-video');
    const audioToggle = document.getElementById('audio-toggle');
    const tapToListen = document.getElementById('tap-to-listen');
    let hasHandledFirstInteraction = false;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
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
    async function handleFirstInteraction(e) {
        // If we've already handled the first interaction, just return
        if (hasHandledFirstInteraction) {
            return;
        }
        
        console.log('Handling first interaction');
        hasHandledFirstInteraction = true;
        
        // Hide the overlay if it exists
        if (tapToListen) {
            tapToListen.style.display = 'none';
            tapToListen.classList.add('hidden');
        }
        
        // Function to attempt video playback
        const attemptPlay = async () => {
            try {
                console.log('Attempting to play video...');
                
                // On mobile, we need to ensure the video is loaded first
                if (isMobile) {
                    video.load();
                    await new Promise(resolve => {
                        video.addEventListener('loadedmetadata', resolve, { once: true });
                    });
                }
                
                // Ensure video is at the beginning
                video.currentTime = 0;
                
                // On mobile, we need to keep the video muted initially
                if (isMobile) {
                    video.muted = true;
                    await video.play();
                    // Then unmute after play starts
                    video.muted = false;
                } else {
                    // On desktop, we can unmute and play directly
                    video.muted = false;
                    await video.play();
                }
                
                console.log('Video playback started successfully');
                updateAudioState(false);
                return true;
                
            } catch (error) {
                console.error('Video play error:', error);
                return false;
            }
        };
        
        // Try to play the video
        let playbackSuccess = await attemptPlay();
        
        // On mobile, try one more time with a different approach if first attempt fails
        if (isMobile && !playbackSuccess) {
            console.log('Retrying with alternative playback method...');
            await attemptPlay();
        }
    }
    
    if (video) {
        console.log('Video element found, initializing...');
        
        // Start with video muted and paused
        video.muted = true;
        video.pause();
        video.currentTime = 0;
        
        // Set up tap to listen overlay
        if (tapToListen) {
            console.log('Setting up tap to listen overlay');
            tapToListen.style.display = 'flex';
            tapToListen.classList.remove('hidden');
        }
        
        function addFirstInteractionListener(element) {
            const options = { passive: false };
            const handler = (e) => {
                // Only call preventDefault if we're actually going to handle the event
                if (!hasHandledFirstInteraction && (!audioToggle || !audioToggle.contains(e.target))) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFirstInteraction(e);
                }
            };
            
            // Add both touch and mouse events
            element.addEventListener('touchstart', handler, options);
            element.addEventListener('click', handler, { ...options, once: true });
            
            // Return cleanup function
            return () => {
                element.removeEventListener('touchstart', handler, options);
                element.removeEventListener('click', handler, { ...options, once: true });
            };
        }
        
        // Add first interaction listeners
        const cleanupVideo = addFirstInteractionListener(video);
        
        // Also add to the tap-to-listen overlay if it exists
        let cleanupTapToListen = null;
        if (tapToListen) {
            cleanupTapToListen = addFirstInteractionListener(tapToListen);
        }
        
        // Set up audio toggle
        if (audioToggle) {
            console.log('Setting up audio toggle');
            audioToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                updateAudioState(!video.muted);
            });
        }
        
        // Debug logging
        const events = ['play', 'playing', 'pause', 'waiting', 'error'];
        events.forEach(event => {
            video.addEventListener(event, (e) => console.log(`Video ${event} event`));
        });
        video.addEventListener('playing', () => console.log('Video playing event'));
        video.addEventListener('pause', () => console.log('Video pause event'));
        video.addEventListener('waiting', () => console.log('Video waiting event'));
        video.addEventListener('error', (e) => console.error('Video error:', e));
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
