// Script pour afficher les convocations sur les pages de catégorie
document.addEventListener('DOMContentLoaded', function() {
    // Déterminer la catégorie depuis l'URL
    const currentFile = window.location.pathname.split('/').pop();
    const categoryMatch = currentFile.match(/categorie-(.+)\.html/);
    
    if (!categoryMatch) return;
    
    const category = categoryMatch[1]; // u12, u13, feminin, etc.
    const storageKey = `convocations_${category}`;
    
    // Récupérer les convocations depuis localStorage
    const convocationsData = localStorage.getItem(storageKey);
    if (!convocationsData) return;
    
    try {
        const convocations = JSON.parse(convocationsData);
        if (!convocations || convocations.length === 0) return;
        
        // Trouver ou créer la section d'affichage
        let displayContainer = document.getElementById('convocations-display');
        if (!displayContainer) {
            const teamRankings = document.querySelector('.team-rankings');
            if (!teamRankings) return;
            
            displayContainer = document.createElement('div');
            displayContainer.id = 'convocations-display';
            displayContainer.className = 'convocations-display-section';
            teamRankings.parentNode.insertBefore(displayContainer, teamRankings.nextSibling);
        }
        
        // Vider le conteneur
        displayContainer.innerHTML = '';
        
        // Ajouter un titre
        const title = document.createElement('h3');
        title.textContent = 'Convocations Récentes';
        title.style.marginTop = '40px';
        title.style.marginBottom = '20px';
        displayContainer.appendChild(title);
        
        // Créer un conteneur pour les convocations
        const convocationsContainer = document.createElement('div');
        convocationsContainer.className = 'convocations-container';
        convocationsContainer.style.display = 'flex';
        convocationsContainer.style.flexWrap = 'wrap';
        convocationsContainer.style.gap = '20px';
        convocationsContainer.style.justifyContent = 'center';
        
        // Afficher les convocations (les plus récentes en premier)
        convocations.slice().reverse().forEach((convocation, index) => {
            const item = document.createElement('div');
            item.className = 'convocation-item-display';
            item.style.maxWidth = '300px';
            item.style.textAlign = 'center';
            
            // Date
            const date = document.createElement('p');
            date.style.fontSize = '12px';
            date.style.color = '#666';
            date.style.marginBottom = '10px';
            date.textContent = new Date(convocation.date || 0).toLocaleDateString('fr-FR');
            item.appendChild(date);
            
            // Afficher la convocation
            if (convocation.type === 'image') {
                const img = document.createElement('img');
                img.src = convocation.data;
                img.alt = 'Convocation';
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.borderRadius = '8px';
                img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                item.appendChild(img);
            } else if (convocation.type === 'pdf') {
                const pdfLink = document.createElement('a');
                pdfLink.href = convocation.data;
                pdfLink.download = `convocation-${category}.pdf`;
                pdfLink.className = 'btn';
                pdfLink.textContent = '📄 Télécharger la Convocation PDF';
                pdfLink.style.display = 'inline-block';
                pdfLink.style.marginTop = '10px';
                item.appendChild(pdfLink);
            }
            
            convocationsContainer.appendChild(item);
        });
        
        displayContainer.appendChild(convocationsContainer);
        
    } catch (error) {
        console.error('Erreur lors du chargement des convocations:', error);
    }
});
