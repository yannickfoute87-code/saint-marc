/* ===========================
   SAINT MARC FOOTBALL - SCRIPT
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav > ul');
    const nav = document.querySelector('nav');

    if (hamburger && navMenu) {
        hamburger.setAttribute('aria-label', 'Ouvrir le menu');
        hamburger.setAttribute('aria-expanded', 'false');

        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active') ? 'true' : 'false');
            hamburger.setAttribute('aria-label', navMenu.classList.contains('active') ? 'Fermer le menu' : 'Ouvrir le menu');
        });

        // Fermer le menu en cliquant en dehors (mobile)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 900) {
                if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        hamburger.classList.remove('active');
                        hamburger.setAttribute('aria-expanded', 'false');
                        hamburger.setAttribute('aria-label', 'Ouvrir le menu');
                        document.querySelectorAll('.dropdown-menu-item').forEach(item => item.classList.remove('active'));
                    }
                }
            }
        });

        const dropdownItems = document.querySelectorAll('.dropdown-menu-item');
        dropdownItems.forEach(item => {
            const link = item.children[0];
            if (!link) return;
            const submenu = item.children[1] && item.children[1].classList && item.children[1].classList.contains('dropdown-submenu')
                ? item.children[1]
                : null;

            link.addEventListener('click', function(e) {
                if (submenu) {
                    e.preventDefault();
                    const isOpen = item.classList.contains('active');

                    dropdownItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherSubmenu = otherItem.children[1] && otherItem.children[1].classList && otherItem.children[1].classList.contains('dropdown-submenu')
                                ? otherItem.children[1]
                                : null;
                            if (otherSubmenu) {
                                otherSubmenu.classList.remove('open');
                            }
                        }
                    });

                    item.classList.toggle('active', !isOpen);
                    if (submenu) {
                        submenu.classList.toggle('open', !isOpen);
                    }
                }
            });
        });

        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
                dropdownItems.forEach(item => {
                    item.classList.remove('active');
                    const submenu = item.children[1] && item.children[1].classList && item.children[1].classList.contains('dropdown-submenu')
                        ? item.children[1]
                        : null;
                    if (submenu) {
                        submenu.classList.remove('open');
                    }
                });
            }
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                const isDropdownToggle = this.parentElement && this.parentElement.classList.contains('dropdown-menu-item') && this.parentElement.querySelector('.dropdown-submenu');

                if (window.innerWidth <= 900 && !isDropdownToggle) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    hamburger.setAttribute('aria-label', 'Ouvrir le menu');
                    dropdownItems.forEach(item => item.classList.remove('active'));
                    dropdownItems.forEach(item => {
                        const submenu = item.children[1] && item.children[1].classList && item.children[1].classList.contains('dropdown-submenu')
                            ? item.children[1]
                            : null;
                        if (submenu) {
                            submenu.classList.remove('open');
                        }
                    });
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
            alert('Message envoyé ! Nous vous répondrons bientôt.');
            contactForm.reset();
        });
    }

    // Hero Photo Stats
    initializeHeroStats();

    // Carousel duplicate for infinite scroll
    initializeCarouselLoop();

    // Document tabs on chartes page
    initializeDocumentTabs();

    // Load pole gallery on équipes page
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

function initializeDocumentTabs() {
    const tabs = document.querySelectorAll('.doc-tab');
    const panels = document.querySelectorAll('.doc-panel');

    if (!tabs.length || !panels.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = tab.getAttribute('data-doc');
            const targetPanel = document.getElementById(targetId);

            if (!targetPanel) return;

            tabs.forEach(item => {
                const isActive = item === tab;
                item.classList.toggle('active', isActive);
                item.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            panels.forEach(panel => {
                const isActive = panel === targetPanel;
                panel.classList.toggle('active', isActive);
                panel.toggleAttribute('hidden', !isActive);
            });
        });
    });
}

function loadPoleGallery() {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const pole = params.get('pole');
    const team = params.get('team');
    const age = params.get('age');
    
    // Map photos to their categories
    const photoCategories = {
        'Seniors A.JPG': 'Seniors A',
        'Seniors B.JPG': 'Seniors B',
        'Seniors C.JPG': 'Seniors C',
        'senior d.jpeg': 'Seniors D',
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

    const seniorTeamLinks = {
        'Seniors A.JPG': 'equipes.html?pole=senior&team=a',
        'Seniors B.JPG': 'equipes.html?pole=senior&team=b',
        'Seniors C.JPG': 'equipes.html?pole=senior&team=c',
        'senior d.jpeg': 'equipes.html?pole=senior&team=d'
    };
    
    // Define photos for each pole
    const polePhotos = {
        senior: {
            title: 'Seniors',
            photos: ['Seniors A.JPG', 'Seniors B.JPG', 'Seniors C.JPG', 'senior d.jpeg']
        },
        'senior-a': {
            title: 'Seniors A',
            photos: ['Seniors A.JPG']
        },
        'senior-b': {
            title: 'Seniors B',
            photos: ['Seniors B.JPG']
        },
        'senior-c': {
            title: 'Seniors C',
            photos: ['Seniors C.JPG']
        },
        'senior-d': {
            title: 'Seniors D',
            photos: ['senior d.jpeg']
        },
        formation: {
            title: 'Pôle Formation',
            photos: ['U16.JPG', 'U17.JPG', 'U17_U18.JPG', 'U18.JPG']
        },
        'formation-u18': {
            title: 'U18',
            photos: ['U18.JPG']
        },
        'formation-u17': {
            title: 'U17',
            photos: ['U17.JPG']
        },
        'formation-u16': {
            title: 'U16',
            photos: ['U16.JPG']
        },
        preformation: {
            title: 'Pôle Préformation',
            photos: ['U13.JPG', 'U14.JPG', 'U14_U15.JPG', 'U15.JPG']
        },
        'ecole-foot': {
            title: 'Pôle École de Foot',
            photos: ['U6_U7.JPG', 'U8.JPG', 'U8_U9.JPG', 'U9.JPG', 'U10.JPG', 'U10_U11.JPG', 'U11.JPG']
        },
        'feminin': {
            title: 'Pôle Féminin',
            photos: ['U14F_U15F.JPG']
        }
    };

    const agePhotos = {
        u18: {
            title: 'U18',
            photos: ['U18.JPG']
        },
        u17: {
            title: 'U17',
            photos: ['U17.JPG']
        },
        u16: {
            title: 'U16',
            photos: ['U16.JPG']
        },
        u15: {
            title: 'U15',
            photos: ['U15.JPG']
        },
        u14: {
            title: 'U14',
            photos: ['U14.JPG']
        },
        u13a: {
            title: 'U13A',
            photos: ['U13.JPG']
        },
        u13: {
            title: 'U13',
            photos: ['U13.JPG']
        },
        u12: {
            title: 'U12',
            photos: ['U12.JPG']
        },
        u11: {
            title: 'U11',
            photos: ['U11.JPG']
        },
        u10: {
            title: 'U10',
            photos: ['U10.JPG']
        },
        u9: {
            title: 'U9',
            photos: ['U9.JPG']
        },
        u8: {
            title: 'U8',
            photos: ['U8.JPG']
        },
        u7: {
            title: 'U7',
            photos: ['U6_U7.JPG']
        },
        u6: {
            title: 'U6',
            photos: ['U6_U7.JPG']
        },
        u14f_u15f: {
            title: 'U14F/U15F',
            photos: ['U14F_U15F.JPG']
        }
    };
    
    // Check if team parameter exists (Seniors A, B, C, D)
    let poleKey = pole;
    if (pole === 'senior' && team) {
        poleKey = `senior-${team}`;
    }
    if (pole === 'formation' && age) {
        poleKey = `formation-${age}`;
    }
    
    const poleData = age && agePhotos[age] ? agePhotos[age] : polePhotos[poleKey];
    const gallery = document.getElementById('photoGallery');
    const title = document.getElementById('poleTitle');
    const poleGallerySection = document.getElementById('poleGallery');
    const detailsSection = document.getElementById('teamDetailsSection');
    const detailsContent = document.getElementById('teamDetailsContent');
    const isTeamView = Boolean((pole === 'senior' && team) || age);
    const detailKey = pole && age ? `${pole}-${age}` : poleKey;
    const seniorDetails = {
        coachLabel: 'Entraîneurs',
        coaches: 'RENAUD LE QUILLIEC, ROMAIN GOUREAU, NICOLAS FRASLIN et IBRAHIMA FALL',
        players: '84 joueurs'
    };
    const poleDetails = {
        senior: seniorDetails,
        'senior-a': {
            coachLabel: 'Entraîneur',
            coaches: 'RENAUD LE QUILLIEC',
            players: '21 joueurs',
            matchLink: 'https://epreuves.fff.fr/competition/club/534841-st-marc-f/equipe/2025_16444_SEM_1/classement',
            matchLinkLabel: 'Classement'
        },
        'senior-b': {
            coachLabel: 'Entraîneur',
            coaches: 'ROMAIN GOUREAU',
            players: '21 joueurs',
            matchLink: 'https://epreuves.fff.fr/competition/club/534841-st-marc-f/equipe/2025_16444_SEM_3/classement',
            matchLinkLabel: 'Classement'
        },
        'senior-c': {
            coachLabel: 'Entraîneur',
            coaches: 'NICOLAS FRASLIN',
            players: '21 joueurs',
            matchLink: 'https://epreuves.fff.fr/competition/club/534841-st-marc-f/equipe/2025_16444_SEM_4/classement',
            matchLinkLabel: 'Classement'
        },
        'senior-d': {
            coachLabel: 'Entraîneur',
            coaches: 'IBRAHIMA FALL',
            players: '21 joueurs',
            matchLink: 'https://epreuves.fff.fr/competition/club/534841-st-marc-f/equipe/2025_16444_SEM_6/classement',
            matchLinkLabel: 'Classement'
        },
        formation: {
            coachLabel: 'Entraîneurs',
            coaches: 'Kylian POUVREAU, Nicolas FRASLIN, Jordan GUIHENEUF',
            players: '60 joueurs'
        },
        'formation-u18': {
            coachLabel: 'Entraîneur',
            coaches: 'Kylian POUVREAU',
            players: '20 joueurs'
        },
        'formation-u17': {
            coachLabel: 'Entraîneur',
            coaches: 'Nicolas FRASLIN',
            players: '20 joueurs',
            matchLink: 'https://epreuves.fff.fr/competition/club/534841-st-marc-f/equipe/2025_16444_U17_9/classement',
            matchLinkLabel: 'Classement'
        },
        'formation-u16': {
            coachLabel: 'Entraîneur',
            coaches: 'Jordan GUIHENEUF',
            players: '20 joueurs',
            matchLink: 'https://epreuves.fff.fr/competition/club/534841-st-marc-f/equipe/2025_16444_U17_10/classement',
            matchLinkLabel: 'Classement'
        },
        u18: {
            coachLabel: 'Entraîneur',
            coaches: 'Kylian POUVREAU',
            players: '20 joueurs'
        },
        u17: {
            coachLabel: 'Entraîneur',
            coaches: 'Nicolas FRASLIN',
            players: '20 joueurs',
            matchLink: 'https://epreuves.fff.fr/competition/club/534841-st-marc-f/equipe/2025_16444_U17_9/classement',
            matchLinkLabel: 'Classement'
        },
        u16: {
            coachLabel: 'Entraîneur',
            coaches: 'Jordan GUIHENEUF',
            players: '20 joueurs',
            matchLink: 'https://epreuves.fff.fr/competition/club/534841-st-marc-f/equipe/2025_16444_U17_10/classement',
            matchLinkLabel: 'Classement'
        },
        preformation: {
            coachLabel: 'Entraîneurs',
            coaches: 'Nutcho GOMES SA, Romain ALIX',
            players: '110 joueurs'
        },
        'preformation-u15': {
            coachLabel: 'Entraîneur',
            coaches: 'Nutcho GOMES SA',
            players: '38 joueurs',
            matchLink: 'https://epreuves.fff.fr/competition/club/534841-st-marc-f/equipe/2025_16444_U15_8/classement',
            matchLinkLabel: 'Classement'
        },
        'preformation-u14': {
            coachLabel: 'Entraîneur',
            coaches: 'Nutcho GOMES SA',
            players: '20 joueurs',
            matchLink: 'https://epreuves.fff.fr/competition/club/534841-st-marc-f/equipe/2025_16444_U15_11/classement',
            matchLinkLabel: 'Classement'
        },
        'preformation-u13a': {
            coachLabel: 'Entraîneur',
            coaches: 'Romain ALIX',
            players: '22 joueurs',
            matchLink: 'https://epreuves.fff.fr/competition/club/534841-st-marc-f/equipe/2025_16444_U13_7/classement',
            matchLinkLabel: 'Classement'
        },
        'preformation-u12': {
            coachLabel: 'Entraîneur',
            coaches: 'Romain ALIX',
            players: '30 joueurs',
            matchLink: 'https://epreuves.fff.fr/competition/club/534841-st-marc-f/equipe/2025_16444_U13_12/classement',
            matchLinkLabel: 'Classement'
        },
        'ecole-foot': {
            coachLabel: 'Entraîneurs',
            coaches: 'Daren CHEVALIER, Kenny MORICEAU, Benoit MICHEL',
            players: '86 joueurs'
        },
        'ecole-foot-u11': {
            coachLabel: 'Entraîneur',
            coaches: 'Daren CHEVALIER',
            players: 'Effectif à confirmer'
        },
        'ecole-foot-u10': {
            coachLabel: 'Entraîneur',
            coaches: 'Daren CHEVALIER',
            players: '21 joueurs'
        },
        'ecole-foot-u9': {
            coachLabel: 'Entraîneur',
            coaches: 'Kenny MORICEAU',
            players: '20 joueurs'
        },
        'ecole-foot-u8': {
            coachLabel: 'Entraîneur',
            coaches: 'Kenny MORICEAU',
            players: 'Effectif à confirmer'
        },
        'ecole-foot-u7': {
            coachLabel: 'Entraîneur',
            coaches: 'Benoit MICHEL',
            players: '15 joueurs'
        },
        'ecole-foot-u6': {
            coachLabel: 'Entraîneur',
            coaches: 'Benoit MICHEL',
            players: '10 joueurs'
        },
        feminin: {
            coachLabel: 'Entraîneurs',
            coaches: 'Jean Christophe, Rasolomanana',
            players: '15 joueuses'
        },
        'feminin-u14f_u15f': {
            coachLabel: 'Entraîneurs',
            coaches: 'Jean Christophe, Rasolomanana',
            players: '15 joueuses'
        }
    };
    
    // Mapping pour les codes d'équipe pour les convocations
    const getTeamConvocationCode = (pole, team, age) => {
        if (pole === 'senior' && team) return `senior_${team}`;
        if (age) {
            const ageMap = {
                'u18': 'u18', 'u17': 'u17', 'u16': 'u16',
                'u15': 'u15', 'u14': 'u14', 'u13a': 'u13', 'u13': 'u13', 'u12': 'u12',
                'u11': 'u11', 'u10': 'u10', 'u9': 'u9', 'u8': 'u8', 'u7': 'u7', 'u6': 'u6',
                'u14f_u15f': 'feminin'
            };
            return ageMap[age] || age;
        }
        return null;
    };

    if (poleData) {
        title.textContent = poleData.title;
        gallery.innerHTML = '';

        const details = poleDetails[detailKey] || poleDetails[poleKey] || poleDetails[age];
        if (isTeamView && details && detailsSection && detailsContent) {
            const selectedPhoto = poleData.photos[0];
            const classementMarkup = details.matchLink ? `
                <a class="btn team-detail-ranking" href="${details.matchLink}" target="_blank" rel="noopener">
                    Voir le classement
                </a>
            ` : `
                <p class="team-detail-muted">Classement à venir</p>
            `;
            
            const convocationCode = getTeamConvocationCode(pole, team, age);
            const convocationMarkup = convocationCode ? `
                <a class="btn team-detail-convocation" href="convocations.html?team=${convocationCode}" style="background: #10b981; margin-top: 10px;">
                    📋 Gestion Convocations
                </a>
            ` : '';

            // Charger les convocations téléversées
            let convocationsGalleryMarkup = '';
            if (convocationCode) {
                const key = 'convocations_' + convocationCode;
                const convocations = JSON.parse(localStorage.getItem(key) || '[]');
                if (convocations.length > 0) {
                    let convCardsHtml = '';
                    convocations.forEach((conv, index) => {
                        const isPdf = conv.type === 'application/pdf';
                        if (isPdf) {
                            convCardsHtml += `
                                <div class="team-convocation-card team-convocation-pdf" onclick="viewPDF('${conv.data}', '${conv.name.replace(/'/g, "\\'")}')">
                                    <div class="team-convocation-icon">📄</div>
                                    <div class="team-convocation-name">${conv.name}</div>
                                    <div class="team-convocation-date">${conv.date}</div>
                                    <div class="team-convocation-actions">
                                        <a href="${conv.data}" download="${conv.name}" class="team-convocation-download" onclick="event.stopPropagation()">Télécharger</a>
                                    </div>
                                </div>
                            `;
                        } else {
                            convCardsHtml += `
                                <div class="team-convocation-card">
                                    <img src="${conv.data}" alt="${conv.name}" class="team-convocation-img">
                                    <div class="team-convocation-name">${conv.name}</div>
                                    <div class="team-convocation-date">${conv.date}</div>
                                    <div class="team-convocation-actions">
                                        <a href="${conv.data}" download="${conv.name}" class="team-convocation-download">Télécharger</a>
                                    </div>
                                </div>
                            `;
                        }
                    });
                    convocationsGalleryMarkup = `
                        <div class="team-convocations-section">
                            <h3>📋 Convocations de l'équipe</h3>
                            <div class="team-convocations-gallery">
                                ${convCardsHtml}
                            </div>
                        </div>
                    `;
                }
            }

            detailsContent.className = 'team-detail-card';
            detailsContent.innerHTML = `
                <div class="team-detail-photo">
                    <img src="photo/${selectedPhoto}" alt="${poleData.title}" loading="eager">
                </div>
                <div class="team-detail-info">
                    <p class="team-detail-label">Equipe</p>
                    <h2>${poleData.title}</h2>
                    <div class="team-detail-list">
                        <p><strong>${details.coachLabel}:</strong> ${details.coaches}</p>
                        <p><strong>Effectif:</strong> ${details.players}</p>
                    </div>
                    ${classementMarkup}
                    ${convocationMarkup}
                </div>
                ${convocationsGalleryMarkup}
            `;
            detailsSection.style.display = 'block';
            if (poleGallerySection) {
                poleGallerySection.style.display = 'none';
            }
            document.querySelectorAll('.container > section').forEach(section => {
                if (section !== detailsSection) {
                    section.style.display = 'none';
                }
            });
            return;
        }

        if (detailsSection) {
            detailsSection.style.display = 'none';
        }
        if (poleGallerySection) {
            poleGallerySection.style.display = '';
        }

        if (details) {
            const infoCard = document.createElement('div');
            infoCard.className = 'pole-info-card';
            infoCard.innerHTML = `
                <div class="info-details">
                    <p><strong>${details.coachLabel}:</strong> ${details.coaches}</p>
                    <p><strong>Effectif:</strong> ${details.players}</p>
                    ${details.matchLink ? `
                        <p class="competition-link">
                            <strong>Compétition:</strong>
                            <a href="${details.matchLink}" target="_blank" rel="noopener">
                                ${details.matchLinkLabel}
                            </a>
                        </p>
                    ` : ''}
                </div>
            `;
            gallery.appendChild(infoCard);
        }

        poleData.photos.forEach((photo, index) => {
            const card = document.createElement('div');
            card.className = 'photo-card';
            // Add special class for feminine pole
            if (poleKey === 'feminin') {
                card.classList.add('photo-card-large');
            }
            const category = poleKey === 'senior-d' || (poleKey === 'senior' && index === 3)
                ? 'Seniors D'
                : photoCategories[photo] || 'Photo';
            const teamLink = poleKey === 'senior' ? seniorTeamLinks[photo] : null;

            if (teamLink) {
                card.classList.add('photo-card-clickable');
                card.innerHTML = `
                    <a class="photo-card-link" href="${teamLink}" aria-label="Voir ${category}">
                        <div class="photo-category">${category}</div>
                        <img src="photo/${photo}" alt="${photo}" loading="lazy">
                    </a>
                `;
            } else {
                card.innerHTML = `
                    <div class="photo-category">${category}</div>
                    <img src="photo/${photo}" alt="${photo}" loading="lazy">
                `;
            }
            gallery.appendChild(card);
        });
    } else if (pole) {
        title.textContent = 'Aucune photo disponible';
        gallery.innerHTML = '<p>Sélectionnez un pôle pour voir les photos.</p>';
    }
}

// Fonction pour rediriger vers le classement sélectionné
function redirectClassement(selectId) {
    const selectElement = document.getElementById(selectId);
    const url = selectElement.value;
    if (url) {
        window.open(url, '_blank');
    } else {
        alert('Veuillez sélectionner une équipe');
    }
}

// Fonction pour afficher une modal PDF
function viewPDF(dataUrl, filename) {
    let modal = document.getElementById('pdfModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'pdfModal';
        modal.className = 'pdf-modal';
        modal.innerHTML = `
            <div class="pdf-modal-content">
                <button class="pdf-modal-close" onclick="closePDF()">&times;</button>
                <h2 id="pdfTitle" style="text-align: center; margin: 0 0 20px 0;"></h2>
                <iframe id="pdfViewer" style="width: 100%; height: calc(100vh - 120px); border: none; border-radius: 8px;"></iframe>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePDF();
            }
        });
    }
    document.getElementById('pdfTitle').textContent = filename;
    document.getElementById('pdfViewer').src = dataUrl;
    modal.style.display = 'flex';
}

function closePDF() {
    const modal = document.getElementById('pdfModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('pdfViewer').src = '';
    }
}
