// Links aleatórios para os vídeos
const motivationalVideos = [
    "https://www.youtube.com/embed/example1",
    "https://www.youtube.com/embed/example2",
    "https://www.youtube.com/embed/example3"
];

const cookingVideos = [
    "https://www.youtube.com/embed/example4",
    "https://www.youtube.com/embed/example5",
    "https://www.youtube.com/embed/example6"
];

const instrumentalVideos = [
    "https://www.youtube.com/embed/example7",
    "https://www.youtube.com/embed/example8",
    "https://www.youtube.com/embed/example9"
];

// Função para definir vídeos aleatórios
function setRandomVideo(elementId, videoList) {
    const randomIndex = Math.floor(Math.random() * videoList.length);
    document.getElementById(elementId).src = videoList[randomIndex];
}

// Exibir vídeos aleatórios ao carregar a página
window.onload = function() {
    alert("Bem-vindo ao Guia de Escape!");

    setRandomVideo("motivational1", motivationalVideos);
    setRandomVideo("motivational2", motivationalVideos);
    setRandomVideo("cooking1", cookingVideos);
    setRandomVideo("cooking2", cookingVideos);
    setRandomVideo("instrumental1", instrumentalVideos);
    setRandomVideo("instrumental2", instrumentalVideos);
};

// Exemplo de mensagem no console
console.log("Bem-vindo ao Guia de Escape!");
