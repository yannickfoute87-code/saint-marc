/* ===========================
   SAINT MARC FOOTBALL - SCRIPT
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        const dropdownItems = document.querySelectorAll('.dropdown-menu-item');
        dropdownItems.forEach(item => {
            const link = item.children[0];
            if (!link) return;

            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 900) {
                    e.preventDefault();
                    const isOpen = item.classList.contains('active');

                    dropdownItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });

                    item.classList.toggle('active', !isOpen);
                }
            });
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                const isDropdownToggle = this.parentElement && this.parentElement.classList.contains('dropdown-menu-item') && this.parentElement.querySelector('.dropdown-submenu');

                if (window.innerWidth <= 900 && !isDropdownToggle) {
                    navMenu.classList.remove('active');
                    dropdownItems.forEach(item => item.classList.remove('active'));
                }
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

    // Load pole gallery on equipes page
    if (document.getElementById('poleGallery')) {
        loadPoleGallery();
    }
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

function loadPoleGallery() {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const pole = params.get('pole');
    const team = params.get('team');
    
    // Map photos to their categories
    const photoCategories = {
        'Seniors A.JPG': 'Senior A',
        'Seniors B.JPG': 'Senior B',
        'Seniors C.JPG': 'Senior C',
        'U16.JPG': 'U16',
        'U17.JPG': 'U17',
        'U17_U18.JPG': 'U17/U18',
        'U18.JPG': 'U18',
        'U13.JPG': 'U13',
        'U14.JPG': 'U14',
        'U14F_U15F.JPG': 'U14F/U15F',
        'U14_U15.JPG': 'U14/U15',
        'U15.JPG': 'U15',
        'U6_U7.JPG': 'U6/U7',
        'U8.JPG': 'U8',
        'U8_U9.JPG': 'U8/U9',
        'U9.JPG': 'U9',
        'U10.JPG': 'U10',
        'U10_U11.JPG': 'U10/U11',
        'U11.JPG': 'U11'
    };
    
    // Define photos for each pole
    const polePhotos = {
        senior: {
            title: 'Pôle Senior',
            photos: ['Seniors A.JPG', 'Seniors B.JPG', 'Seniors C.JPG']
        },
        'senior-a': {
            title: 'Senior A',
            photos: ['Seniors A.JPG']
        },
        'senior-b': {
            title: 'Senior B',
            photos: ['Seniors B.JPG']
        },
        'senior-c': {
            title: 'Senior C',
            photos: ['Seniors C.JPG']
        },
        'u17-18': {
            title: 'Pôle U17/U18',
            photos: ['U16.JPG', 'U17.JPG', 'U17_U18.JPG', 'U18.JPG']
        },
        'u13-15': {
            title: 'Pôle U13/U15',
            photos: ['U13.JPG', 'U14.JPG', 'U14F_U15F.JPG', 'U14_U15.JPG', 'U15.JPG']
        },
        'u7-u9-u11': {
            title: 'Pôle U7/U9/U11',
            photos: ['U6_U7.JPG', 'U8.JPG', 'U8_U9.JPG', 'U9.JPG', 'U10.JPG', 'U10_U11.JPG', 'U11.JPG']
        },
        'feminin': {
            title: 'Pôle Féminin',
            photos: ['U14F_U15F.JPG']
        },
        'loisir': {
            title: 'Pôle Équipe Loisirs',
            photos: ['Seniors A.JPG', 'Seniors B.JPG', 'Seniors C.JPG']
        }
    };
    
    // Check if team parameter exists (Senior A, B, C)
    let poleKey = pole;
    if (pole === 'senior' && team) {
        poleKey = `senior-${team}`;
    }
    
    const poleData = polePhotos[poleKey];
    const gallery = document.getElementById('photoGallery');
    const title = document.getElementById('poleTitle');
    
    if (poleData) {
        title.textContent = poleData.title;
        gallery.innerHTML = '';
        
        poleData.photos.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'photo-card';
            // Add special class for feminine pole
            if (poleKey === 'feminin') {
                card.classList.add('photo-card-large');
            }
            const category = photoCategories[photo] || 'Photo';
            card.innerHTML = `
                <div class="photo-category">${category}</div>
                <img src="photo/${photo}" alt="${photo}" loading="lazy">
            `;
            gallery.appendChild(card);
        });
    } else if (pole) {
        title.textContent = 'Aucune photo disponible';
        gallery.innerHTML = '<p>Sélectionnez un pôle pour voir les photos.</p>';
    }
}

