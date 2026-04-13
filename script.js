/* ===========================
   SAINT MARC FOOTBALL - SCRIPT
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // Form handling (if needed)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simple success message
            alert('Message envoyé! Nous vous répondrons bientôt.');
            contactForm.reset();
        });
    }

    // Hero Photo Stats
    initializeHeroStats();

    // Carousel duplicate for infinite scroll
    initializeCarouselLoop();

    // Pole Dropdown
    initializePoleDropdown();
});

function initializeHeroStats() {
    const viewCountEl = document.getElementById('viewCount');
    const likeCountEl = document.getElementById('likeCount');
    const likeBtn = document.getElementById('likeBtn');
    const heroSection = document.getElementById('heroSection');

    if (!viewCountEl || !likeBtn) return;

    // Load stats from localStorage
    let stats = JSON.parse(localStorage.getItem('heroStats')) || {
        views: 0,
        likes: 0,
        liked: false
    };

    // Increment views on page load
    stats.views++;
    localStorage.setItem('heroStats', JSON.stringify(stats));

    // Display stats
    viewCountEl.textContent = stats.views;
    likeCountEl.textContent = stats.likes;

    // Update like button state
    if (stats.liked) {
        likeBtn.classList.add('liked');
    }

    // Like button click handler
    likeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        stats = JSON.parse(localStorage.getItem('heroStats'));
        
        if (stats.liked) {
            // Unlike
            stats.likes--;
            stats.liked = false;
            likeBtn.classList.remove('liked');
        } else {
            // Like
            stats.likes++;
            stats.liked = true;
            likeBtn.classList.add('liked');
        }

        localStorage.setItem('heroStats', JSON.stringify(stats));
        likeCountEl.textContent = stats.likes;
    });
}

function initializeCarouselLoop() {
    const track = document.getElementById('carouselTrackBg');
    
    if (!track) return;

    // Duplicate all images for seamless loop
    const images = Array.from(track.querySelectorAll('img'));
    images.forEach(img => {
        const clone = img.cloneNode(true);
        track.appendChild(clone);
    });
}

function initializePoleDropdown() {
    const poleDropdown = document.getElementById('poleDropdown');
    
    if (!poleDropdown) return;

    poleDropdown.addEventListener('change', function() {
        const selectedPole = this.value;
        
        if (selectedPole === '') {
            // Show all sections
            console.log('Afficher tous les pôles');
        } else if (selectedPole === 'senior') {
            console.log('Afficher: Pôle Senior');
        } else if (selectedPole === 'u17-18') {
            console.log('Afficher: Pôle U17/U18');
        } else if (selectedPole === 'u13-15') {
            console.log('Afficher: Pôle U13/U15');
        } else if (selectedPole === 'u7-u9-u11') {
            console.log('Afficher: Pôle U7/U9/U11');
        } else if (selectedPole === 'feminin') {
            console.log('Afficher: Pôle Féminin');
        }
        
        // Save selection to localStorage
        localStorage.setItem('selectedPole', selectedPole);
    });
    
    // Restore previous selection
    const savedPole = localStorage.getItem('selectedPole');
    if (savedPole) {
        poleDropdown.value = savedPole;
    }
}


