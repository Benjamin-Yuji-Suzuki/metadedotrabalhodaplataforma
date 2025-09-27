// script.js

// --- CONFIGURAÇÃO E DADOS ---
const CREATOR_ID = 'creator123';
// Credenciais: Usuário = 'admin', Senha = '12345'
let isLoggedIn = false;

const videos = [
    {
        id: 'v1',
        title: 'Introdução ao HTML Básico',
        description: 'Primeiros passos no mundo do HTML.',
        src: 'videos/intro-html.mp4', 
        thumbnail: 'thumbnails/thumb-html.jpg', 
        tags: ['html', 'iniciante', 'web'],
        creatorId: CREATOR_ID // VÍDEO DO CRIADOR LOGADO
    },
    {
        id: 'v2',
        title: 'Dicas Essenciais de CSS e Layout Flexbox',
        description: 'Melhore o visual da sua plataforma com CSS.',
        src: 'videos/dicas-css.mp4', 
        thumbnail: 'thumbnails/thumb-css.jpg', 
        tags: ['css', 'design', 'estilo'],
        creatorId: 'otheruser' // VÍDEO DE OUTRO USUÁRIO (NÃO APARECERÁ em "Seus Vídeos")
    },
    {
        id: 'v3',
        title: 'JavaScript: Manipulação Simples do DOM',
        description: 'Aprenda a dar vida à sua página web com JS.',
        src: 'videos/js-intro.mp4', 
        thumbnail: 'thumbnails/thumb-js.jpg', 
        tags: ['javascript', 'programacao', 'logica'],
        creatorId: CREATOR_ID // VÍDEO DO CRIADOR LOGADO
    },
];

// --- REFERÊNCIAS DOM ---
const videoGrid = document.getElementById('video-grid');
const videoModal = document.getElementById('video-modal');
const player = document.getElementById('player');
const videoTitle = document.getElementById('video-title');
const loginButton = document.getElementById('login-button');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const menuToggle = document.getElementById('menu-toggle');
const body = document.body;

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
    videoGrid.innerHTML = ''; 
    if (videoList.length === 0) {
        videoGrid.innerHTML = '<p style="padding: 20px; font-size: 1.2em;">Nenhum vídeo encontrado. Tente outra busca ou poste um novo conteúdo.</p>';
        return;
    }
    videoList.forEach(video => renderVideoCard(video));
}

// 1. VISUALIZAÇÃO (ABRIR VÍDEO)
function openVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (video) {
        player.src = video.src;
        videoTitle.textContent = video.title;
        videoModal.style.display = 'block';
    }
}

// 2. VISUALIZAÇÃO (FECHAR VÍDEO)
function closeModal(event) {
    if (event.target.id === 'video-modal' || event.target.className === 'close') {
        player.pause(); 
        player.src = ''; 
        videoModal.style.display = 'none';
    }
}

// 3. PESQUISA (FILTRO)
function filterVideos() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    
    // Se o usuário estiver na view "Seus Vídeos", filtra APENAS nessa lista
    const listToFilter = body.classList.contains('user-view') 
        ? videos.filter(v => v.creatorId === CREATOR_ID) 
        : videos;

    const filteredList = listToFilter.filter(video => {
        const titleMatch = video.title.toLowerCase().includes(searchTerm);
        const descriptionMatch = video.description.toLowerCase().includes(searchTerm);
        const tagsMatch = video.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        return titleMatch || descriptionMatch || tagsMatch;
    });

    loadVideos(filteredList);
}

// --- FUNÇÕES DE LOGIN/LOGOUT E INTERFACE ---

loginButton.onclick = () => {
    if (!isLoggedIn) {
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

    // SIMULAÇÃO DE LOGIN: admin/12345
    if (username === 'admin' && password === '12345') {
        handleLoginSuccess();
    } else {
        errorMessage.style.display = 'block';
    }
};

function handleLoginSuccess() {
    isLoggedIn = true;
    loginModal.style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    // Atualiza a interface
    loginButton.textContent = 'Logout';
    menuToggle.classList.remove('hidden'); // Mostra o ícone de menu
    body.classList.remove('user-view'); // Garante que a view inicial é a de todos
    
    // Re-carrega a grade para o estado inicial
    loadVideos(videos); 
}

function handleLogout() {
    isLoggedIn = false;
    
    // Atualiza a interface
    loginButton.textContent = 'Login';
    menuToggle.classList.add('hidden'); // Oculta o ícone de menu
    body.classList.remove('sidebar-open'); // Fecha a sidebar
    body.classList.remove('user-view'); // Sai da view de usuário
    
    // Re-carrega a grade para mostrar todos os vídeos
    loadVideos(videos);
}

// --- FUNÇÕES DA SIDEBAR ---

// Toggle da Sidebar (mostrar/esconder)
menuToggle.onclick = () => {
    body.classList.toggle('sidebar-open');
};

// 4. LISTAR VÍDEOS (SEUS VÍDEOS)
function showUserVideos() {
    if (!isLoggedIn) return; 

    body.classList.remove('sidebar-open'); // Fecha a sidebar
    body.classList.add('user-view'); // Define a view atual como 'user'
    
    // FILTRA APENAS os vídeos criados pelo usuário logado
    const userVideos = videos.filter(v => v.creatorId === CREATOR_ID);
    
    // Atualiza a grade com a lista filtrada
    loadVideos(userVideos);
    
    // Limpa a barra de pesquisa para evitar conflito de filtro
    document.getElementById('search-bar').value = '';
}

// Inicializa a plataforma
document.addEventListener('DOMContentLoaded', () => {
    loadVideos(videos);
});