let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    
    currentSlide += direction;
    
    // Loop infinito
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    // Move o carrossel
    const translateX = -currentSlide * 100;
    track.style.transform = `translateX(${translateX}%)`;
}

// Auto-play do carrossel (opcional)
function autoPlay() {
    moveCarousel(1);
}

// Inicia o auto-play a cada 5 segundos
setInterval(autoPlay, 5000);

// Pausa o auto-play quando o mouse está sobre o carrossel
const carouselContainer = document.querySelector('.carousel-container');
let autoPlayInterval;

function startAutoPlay() {
    autoPlayInterval = setInterval(autoPlay, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

carouselContainer.addEventListener('mouseenter', stopAutoPlay);
carouselContainer.addEventListener('mouseleave', startAutoPlay);

// Inicia o auto-play
startAutoPlay();

// Suporte para navegação por teclado
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        moveCarousel(-1);
    } else if (event.key === 'ArrowRight') {
        moveCarousel(1);
    }
}); 