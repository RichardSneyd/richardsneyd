document.addEventListener('DOMContentLoaded', function() {
    const readMoreBtn = document.getElementById('readMoreBtn');
    const collapsibleContent = document.getElementById('collapsibleBio');
    
    if (readMoreBtn && collapsibleContent) {
        // Function to toggle the content
        const toggleContent = () => {
            const isExpanded = readMoreBtn.getAttribute('aria-expanded') === 'true';
            readMoreBtn.setAttribute('aria-expanded', !isExpanded);
            collapsibleContent.classList.toggle('expanded');
            
            // Update the button text
            const readMoreText = readMoreBtn.querySelector('.read-more-text');
            if (readMoreText) {
                readMoreText.textContent = isExpanded ? 'Read More' : 'Show Less';
            }
            
            // Smooth scroll to top of content when expanding
            if (!isExpanded) {
                setTimeout(() => {
                    collapsibleContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        };
        
        // Add click event
        readMoreBtn.addEventListener('click', toggleContent);
        
        // Add keyboard support
        readMoreBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleContent();
            }
        });
        
        // Initialize the button text
        const readMoreText = readMoreBtn.querySelector('.read-more-text');
        if (readMoreText) {
            readMoreText.textContent = 'Read More';
        }
    }
});
