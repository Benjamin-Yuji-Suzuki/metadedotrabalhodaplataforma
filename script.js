// script.js

// Estrutura de dados para simular o "banco de dados" de vídeos
const videos = [
    {
        id: 'v1',
        title: 'Introdução ao HTML Básico',
        description: 'Primeiros passos no mundo do HTML e estrutura de páginas.',
        src: 'videos/intro-html.mp4', // <--- AJUSTE AQUI
        thumbnail: 'thumbnails/thumb-html.jpg', // <--- AJUSTE AQUI
        tags: ['html', 'iniciante', 'web', 'frontend']
    },
    {
        id: 'v2',
        title: 'Dicas Essenciais de CSS e Layout Flexbox',
        description: 'Melhore o visual da sua plataforma com CSS e aprenda Flexbox.',
        src: 'videos/dicas-css.mp4', // <--- AJUSTE AQUI
        thumbnail: 'thumbnails/thumb-css.jpg', // <--- AJUSTE AQUI
        tags: ['css', 'design', 'estilo', 'flexbox']
    },
    {
        id: 'v3',
        title: 'JavaScript: Manipulação Simples do DOM',
        description: 'Aprenda a dar vida à sua página web com JS.',
        src: 'videos/js-intro.mp4', // <--- AJUSTE AQUI
        thumbnail: 'thumbnails/thumb-js.jpg', // <--- AJUSTE AQUI
        tags: ['javascript', 'programacao', 'logica', 'dom']
    },
    // Adicione mais objetos de vídeo aqui, seguindo o mesmo padrão
];

const videoGrid = document.getElementById('video-grid');
const videoModal = document.getElementById('video-modal');
const player = document.getElementById('player');
const videoTitle = document.getElementById('video-title');

// 1. Função para Renderizar um Card de Vídeo
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

// 2. Função para Carregar/Atualizar a Grade de Vídeos
function loadVideos(videoList) {
    videoGrid.innerHTML = ''; 
    if (videoList.length === 0) {
        videoGrid.innerHTML = '<p>Nenhum vídeo encontrado. Tente outra busca.</p>';
        return;
    }
    videoList.forEach(video => renderVideoCard(video));
}

// 3. FUNÇÃO DE VISUALIZAÇÃO (ABRIR VÍDEO)
function openVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (video) {
        player.src = video.src;
        videoTitle.textContent = video.title;
        videoModal.style.display = 'block';
    }
}

// 4. FUNÇÃO DE VISUALIZAÇÃO (FECHAR VÍDEO)
function closeModal(event) {
    // Fecha se clicar no botão 'x' ou fora do conteúdo do modal
    if (event.target.id === 'video-modal' || event.target.className === 'close') {
        player.pause(); // Pausa o vídeo
        player.src = ''; // Limpa a fonte para liberar memória
        videoModal.style.display = 'none';
    }
}

// 5. FUNÇÃO DE PESQUISA (FILTRO)
function filterVideos() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();

    const filteredList = videos.filter(video => {
        // Busca no título, descrição OU tags
        const titleMatch = video.title.toLowerCase().includes(searchTerm);
        const descriptionMatch = video.description.toLowerCase().includes(searchTerm);
        const tagsMatch = video.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        return titleMatch || descriptionMatch || tagsMatch;
    });

    loadVideos(filteredList);
}

// Inicializa a plataforma
document.addEventListener('DOMContentLoaded', () => {
    loadVideos(videos);
});