// Convocation Management System
const PASSWORD = 'yaya';
const STORAGE_KEY = 'convocations_';

// Get category from URL (u12, u13, etc.)
function getCategory() {
    const path = window.location.pathname;
    const match = path.match(/convocation-(u\d+|feminin|seniot)/i);
    return match ? match[1].toLowerCase() : 'u12';
}

const category = getCategory();
const categoryStorageKey = STORAGE_KEY + category;

// DOM Elements
const authContainer = document.getElementById('auth-container');
const coachSection = document.getElementById('coach-section');
const publicSection = document.getElementById('public-section');
const authPasswordInput = document.getElementById('auth-password');
const authBtn = document.getElementById('auth-btn');
const authError = document.getElementById('auth-error');
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const fileLabel = document.querySelector('.file-label');
const convocationItems = document.getElementById('convocation-items');
const publicConvocations = document.getElementById('public-convocations');
const logoutBtn = document.getElementById('logout-btn');

let isAuthenticated = false;
let selectedFile = null;

// Check if authenticated
function checkAuth() {
    const authToken = localStorage.getItem('convocation_auth_' + category);
    if (authToken === PASSWORD) {
        isAuthenticated = true;
        showCoachPanel();
    } else {
        isAuthenticated = false;
        showAuthPanel();
    }
}

// Show auth panel
function showAuthPanel() {
    authContainer.style.display = 'block';
    coachSection.style.display = 'none';
    publicSection.style.display = 'none';
}

// Show coach panel
function showCoachPanel() {
    authContainer.style.display = 'none';
    coachSection.style.display = 'block';
    publicSection.style.display = 'none';
    loadConvocations();
}

// Show public panel
function showPublicPanel() {
    authContainer.style.display = 'none';
    coachSection.style.display = 'none';
    publicSection.style.display = 'block';
    loadPublicConvocations();
}

// Authentication
authBtn.addEventListener('click', () => {
    const password = authPasswordInput.value;
    authError.textContent = '';
    
    if (password === PASSWORD) {
        localStorage.setItem('convocation_auth_' + category, PASSWORD);
        isAuthenticated = true;
        showCoachPanel();
    } else {
        authError.textContent = '❌ Mot de passe incorrect';
        authPasswordInput.value = '';
    }
});

authPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        authBtn.click();
    }
});

// File handling
fileInput.addEventListener('change', (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
        fileLabel.querySelector('span:last-child').textContent = selectedFile.name;
    }
});

// Drag and drop
fileLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileLabel.style.background = 'rgba(0, 61, 165, 0.1)';
});

fileLabel.addEventListener('dragleave', () => {
    fileLabel.style.background = '';
});

fileLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    fileLabel.style.background = '';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        selectedFile = files[0];
        fileLabel.querySelector('span:last-child').textContent = selectedFile.name;
    }
});

// Upload file
uploadBtn.addEventListener('click', () => {
    if (!selectedFile) {
        alert('Veuillez sélectionner un fichier');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const fileData = {
            name: selectedFile.name,
            type: selectedFile.type,
            data: e.target.result,
            date: new Date().toLocaleString('fr-FR'),
            match: document.getElementById('match-name')?.value || `Match du ${new Date().toLocaleDateString('fr-FR')}`
        };

        let convocations = JSON.parse(localStorage.getItem(categoryStorageKey)) || [];
        convocations.push(fileData);
        localStorage.setItem(categoryStorageKey, JSON.stringify(convocations));

        selectedFile = null;
        fileInput.value = '';
        fileLabel.querySelector('span:last-child').textContent = 'Cliquez ou glissez un fichier ici';
        
        alert('✅ Convocation téléversée avec succès!');
        loadConvocations();
    };
    reader.readAsDataURL(selectedFile);
});

// Load convocations in coach panel
function loadConvocations() {
    const convocations = JSON.parse(localStorage.getItem(categoryStorageKey)) || [];
    
    if (convocations.length === 0) {
        convocationItems.innerHTML = '<p class="empty-message">Aucune convocation téléversée pour le moment</p>';
        return;
    }

    convocationItems.innerHTML = convocations.map((conv, index) => `
        <div class="convocation-item">
            <div class="convocation-info">
                <h4>${conv.match}</h4>
                <p class="file-name">📄 ${conv.name}</p>
                <p class="file-date">Téléversé le: ${conv.date}</p>
            </div>
            <div class="convocation-actions">
                <button class="btn btn-small" onclick="previewFile(${index})">Prévisualiser</button>
                <button class="btn btn-danger btn-small" onclick="deleteConvocation(${index})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// Load public convocations
function loadPublicConvocations() {
    const convocations = JSON.parse(localStorage.getItem(categoryStorageKey)) || [];
    
    if (convocations.length === 0) {
        publicConvocations.innerHTML = '<p class="empty-message">Aucune convocation disponible pour le moment</p>';
        return;
    }

    publicConvocations.innerHTML = convocations.map((conv, index) => `
        <div class="public-convocation-item">
            <div class="convocation-header">
                <h3>${conv.match}</h3>
                <p class="convocation-date">Publié le: ${conv.date}</p>
            </div>
            <div class="convocation-preview">
                ${renderPreview(conv)}
            </div>
        </div>
    `).join('');
}

// Render file preview
function renderPreview(conv) {
    if (conv.type.startsWith('image/')) {
        return `<img src="${conv.data}" alt="Convocation" class="convocation-image">`;
    } else if (conv.type === 'application/pdf') {
        return `
            <div class="pdf-placeholder">
                <p>📄 Document PDF</p>
                <a href="${conv.data}" download="${conv.name}" class="btn btn-small">Télécharger le PDF</a>
            </div>
        `;
    }
    return '<p>Format non supporté pour la prévisualisation</p>';
}

// Preview file
window.previewFile = function(index) {
    const convocations = JSON.parse(localStorage.getItem(categoryStorageKey)) || [];
    const conv = convocations[index];
    
    const previewWindow = window.open();
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Prévisualisation - ${conv.name}</title>
            <style>
                body { 
                    margin: 0; 
                    padding: 20px; 
                    background: #f5f5f5;
                    font-family: Arial, sans-serif;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                h1 { color: #003DA5; margin-bottom: 20px; }
                img { max-width: 100%; height: auto; }
                .pdf-info { color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${conv.match}</h1>
                ${renderPreview(conv)}
                <p class="pdf-info">Fichier: ${conv.name}</p>
            </div>
        </body>
        </html>
    `);
    previewWindow.document.close();
};

// Delete convocation
window.deleteConvocation = function(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette convocation?')) {
        let convocations = JSON.parse(localStorage.getItem(categoryStorageKey)) || [];
        convocations.splice(index, 1);
        localStorage.setItem(categoryStorageKey, JSON.stringify(convocations));
        alert('✅ Convocation supprimée');
        loadConvocations();
    }
};

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('convocation_auth_' + category);
    isAuthenticated = false;
    authPasswordInput.value = '';
    authError.textContent = '';
    showAuthPanel();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // If not authenticated, show public convocations instead of auth
    if (!isAuthenticated) {
        // Check for query parameter to determine view
        const params = new URLSearchParams(window.location.search);
        if (params.get('view') === 'public') {
            showPublicPanel();
        } else {
            // Show auth by default
            showAuthPanel();
        }
    }
});
