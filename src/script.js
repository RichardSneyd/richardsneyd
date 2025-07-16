// Initialize audio toggle functionality
function initializeAudio() {
    const video = document.getElementById('hero-video');
    const audioToggle = document.getElementById('audio-toggle');
    const tapToListen = document.getElementById('tap-to-listen');
    let hasHandledFirstInteraction = false;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Function to update audio state based on video state
    function updateAudioState(isMuted) {
        if (!audioToggle) return;
        
        const icon = audioToggle.querySelector('i');
        if (!icon) return;
        
        try {
            if (isMuted) {
                video.muted = true;
                icon.classList.remove('fa-volume-up');
                icon.classList.add('fa-volume-mute');
            } else {
                // Only try to unmute if video is already playing
                if (video.paused) {
                    video.play().catch(e => console.warn('Play failed:', e));
                }
                try {
                    video.muted = false;
                    icon.classList.remove('fa-volume-mute');
                    icon.classList.add('fa-volume-up');
                } catch (e) {
                    console.warn('Could not unmute video:', e);
                    // If unmute fails, keep the muted state
                    video.muted = true;
                    icon.classList.remove('fa-volume-up');
                    icon.classList.add('fa-volume-mute');
                }
            }
        } catch (e) {
            console.error('Error updating audio state:', e);
        }
    }
    
    // Function to safely unmute the video
    function safeUnmute() {
        try {
            if (video && !video.muted) return; // Already unmuted
            
            // Store the current time to prevent seeking
            const currentTime = video.currentTime;
            
            // Unmute and update UI
            video.muted = false;
            updateAudioState(false);
            
            // Restore playback position if needed
            if (video.currentTime !== currentTime) {
                video.currentTime = currentTime;
            }
            
            console.log('Video unmuted successfully');
        } catch (error) {
            console.warn('Safe unmute failed:', error);
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
                
                // Ensure video is at the beginning
                video.currentTime = 0;
                
                // Always start with muted video to comply with autoplay policies
                video.muted = true;
                
                // First, ensure the video is loaded
                if (video.readyState < 3) { // HAVE_FUTURE_DATA
                    await new Promise((resolve, reject) => {
                        const onCanPlay = () => {
                            video.removeEventListener('canplay', onCanPlay);
                            resolve();
                        };
                        video.addEventListener('canplay', onCanPlay, { once: true });
                    });
                }
                
                // Play the video (muted)
                await video.play();
                console.log('Muted video playback started');
                
                // Schedule unmute attempt after a short delay
                // This helps with Chrome's autoplay restrictions
                setTimeout(() => {
                    safeUnmute();
                    
                    // Try again after another short delay as a fallback
                    setTimeout(safeUnmute, 100);
                }, 200);
                
                updateAudioState(true); // Start with muted state
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

    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        // Initialize first FAQ item as open by default
        if (faqItems[0]) {
            faqItems[0].classList.add('active');
        }
        
        // Handle FAQ item clicks
        faqItems.forEach((item) => {
            const question = item.querySelector('h4');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items first
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
                
                // Handle smooth scrolling for better UX
                if (!isActive) {
                    setTimeout(() => {
                        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                }
            });
            
            // Handle keyboard navigation
            question.setAttribute('tabindex', '0');
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
                
                // Arrow key navigation between FAQ items
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const currentIndex = Array.from(faqItems).indexOf(item);
                    let nextIndex;
                    
                    if (e.key === 'ArrowDown' && currentIndex < faqItems.length - 1) {
                        nextIndex = currentIndex + 1;
                    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                        nextIndex = currentIndex - 1;
                    }
                    
                    if (nextIndex !== undefined) {
                        faqItems[nextIndex].querySelector('h4').focus();
                    }
                }
            });
        });
        
        // Close FAQ when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.faq-item')) {
                faqItems.forEach(item => item.classList.remove('active'));
            }
        });
    }

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
