// script.js

// --- CONFIGURAÇÃO E DADOS ---
const users = [
    { 
        id: 'creator123', 
        username: 'admin', 
        password: '12345' 
    },
    { 
        id: 'user_joana_456', 
        username: 'joana', 
        password: '123' // SENHA ALTERADA AQUI
    }
];

let loggedInUser = null; 
let isConnectionOffline = false;

const videos = [
    { id: 'v1', title: 'Introdução ao HTML Básico', description: 'Primeiros passos no mundo do HTML.', src: 'videos/intro-html.mp4', thumbnail: 'thumbnails/thumb-html.jpg', tags: ['html', 'iniciante', 'web'], creatorId: 'creator123' },
    { id: 'v2', title: 'Dicas Essenciais de CSS e Layout Flexbox', description: 'Melhore o visual da sua plataforma com CSS.', src: 'videos/dicas-css.mp4', thumbnail: 'thumbnails/thumb-css.jpg', tags: ['css', 'design', 'estilo'], creatorId: 'otheruser' },
    { id: 'v3', title: 'JavaScript: Manipulação Simples do DOM', description: 'Aprenda a dar vida à sua página web com JS.', src: 'videos/js-intro.mp4', thumbnail: 'thumbnails/thumb-js.jpg', tags: ['javascript', 'programacao', 'logica'], creatorId: 'creator123' },
    { id: 'v4', title: 'Introdução ao Design Responsivo', description: 'Faça seu site funcionar em qualquer tela.', src: 'videos/responsive-design.mp4', thumbnail: 'thumbnails/thumb-responsive.jpg', tags: ['css', 'responsivo', 'design'], creatorId: 'user_joana_456' }
];

// --- REFERÊNCIAS DOM ---
const videoGrid = document.getElementById('video-grid');
const offlineMessage = document.getElementById('offline-message');
const retryButton = document.getElementById('retry-button');
const videoModal = document.getElementById('video-modal');
const player = document.getElementById('player');
const videoTitle = document.getElementById('video-title');
const loginButton = document.getElementById('login-button');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const menuToggle = document.getElementById('menu-toggle');
const body = document.body;

// --- LÓGICA DE SIMULAÇÃO DE CONEXÃO ---
function simulateConnectionError() {
    console.log("Simulando erro de conexão...");
    isConnectionOffline = true;
    body.classList.remove('sidebar-open');
    fetchAndLoadInitialVideos();
}

function fetchAndLoadInitialVideos() {
    videoGrid.innerHTML = '';
    if (isConnectionOffline) {
        videoGrid.classList.add('hidden');
        offlineMessage.classList.remove('hidden');
    } else {
        videoGrid.classList.remove('hidden');
        offlineMessage.classList.add('hidden');
        loadVideos(videos);
    }
}

retryButton.onclick = () => {
    console.log("Tentando reconectar...");
    isConnectionOffline = false;
    fetchAndLoadInitialVideos();
};

// --- FUNÇÕES GERAIS DE VÍDEOS ---
function renderVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.onclick = () => openVideo(video.id);
    card.innerHTML = `
        <img src="${video.thumbnail}" alt="Thumbnail do vídeo: ${video.title}">
        <div class="video-card-info">
            <h3>${video.title}</h3>
            <p title="${video.description}">${video.description.substring(0, 50)}...</p>
        </div>
    `;
    videoGrid.appendChild(card);
}

function loadVideos(videoList) {
    videoGrid.classList.remove('hidden');
    offlineMessage.classList.add('hidden');
    videoGrid.innerHTML = ''; 
    if (videoList.length === 0) {
        videoGrid.innerHTML = '<p style="padding: 20px; font-size: 1.2em;">Nenhum vídeo encontrado.</p>';
        return;
    }
    videoList.forEach(video => renderVideoCard(video));
}

function openVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (video) {
        player.src = video.src;
        videoTitle.textContent = video.title;
        videoModal.style.display = 'block';
    }
}

function closeModal(event) {
    if (event.target.id === 'video-modal' || event.target.className === 'close') {
        player.pause(); 
        player.src = ''; 
        videoModal.style.display = 'none';
    }
}

function filterVideos() {
    if (isConnectionOffline) return;
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const listToFilter = body.classList.contains('user-view') && loggedInUser 
        ? videos.filter(v => v.creatorId === loggedInUser.id) 
        : videos;
    const filteredList = listToFilter.filter(video => 
        video.title.toLowerCase().includes(searchTerm) || 
        video.description.toLowerCase().includes(searchTerm) || 
        video.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    loadVideos(filteredList);
}

// --- FUNÇÕES DE LOGIN/LOGOUT E INTERFACE ---
loginButton.onclick = () => {
    if (!loggedInUser) {
        loginModal.style.display = 'block';
    } else {
        handleLogout();
    }
};

function closeLoginModal(event) {
    if (event.target.id === 'login-modal' || event.target.className === 'close') {
        loginModal.style.display = 'none';
        document.getElementById('login-error').style.display = 'none';
    }
}

loginForm.onsubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('login-error');
    const foundUser = users.find(user => user.username === username && user.password === password);
    if (foundUser) {
        handleLoginSuccess(foundUser);
    } else {
        errorMessage.style.display = 'block';
    }
};

function handleLoginSuccess(user) {
    loggedInUser = user; 
    loginModal.style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    loginButton.textContent = 'Logout';
    menuToggle.classList.remove('hidden'); 
    body.classList.remove('user-view'); 
    fetchAndLoadInitialVideos(); 
}

function handleLogout() {
    loggedInUser = null; 
    loginButton.textContent = 'Login';
    menuToggle.classList.add('hidden'); 
    body.classList.remove('sidebar-open'); 
    body.classList.remove('user-view'); 
    fetchAndLoadInitialVideos();
}

// --- FUNÇÕES DA SIDEBAR ---
menuToggle.onclick = () => {
    body.classList.toggle('sidebar-open');
};

function showUserVideos() {
    if (!loggedInUser || isConnectionOffline) return;
    body.classList.remove('sidebar-open'); 
    body.classList.add('user-view'); 
    const userVideos = videos.filter(v => v.creatorId === loggedInUser.id);
    loadVideos(userVideos);
    document.getElementById('search-bar').value = '';
}

// --- INICIALIZAÇÃO DA PLATAFORMA ---
document.addEventListener('DOMContentLoaded', () => {
    fetchAndLoadInitialVideos();
});