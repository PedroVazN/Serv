let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
let autoPlayInterval;

function updateCarousel() {
    slides.forEach((slide, index) => {
        // Remove todas as classes
        slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden');
        
        // Calcula a posição relativa ao slide atual
        let position = index - currentSlide;
        
        // Normaliza a posição para o loop infinito
        if (position > totalSlides / 2) {
            position -= totalSlides;
        } else if (position < -totalSlides / 2) {
            position += totalSlides;
        }
        
        // Aplica as classes baseadas na posição
        if (position === 0) {
            slide.classList.add('active');
        } else if (position === -1) {
            slide.classList.add('prev');
        } else if (position === 1) {
            slide.classList.add('next');
        } else if (position === -2) {
            slide.classList.add('far-prev');
        } else if (position === 2) {
            slide.classList.add('far-next');
        } else {
            slide.classList.add('hidden');
        }
    });
    
    updateIndicators();
}

function moveCarousel(direction) {
    currentSlide += direction;
    
    // Loop infinito
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

function createIndicators() {
    const carouselSection = document.querySelector('.carousel-section .container');
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
    
    carouselSection.appendChild(indicatorsContainer);
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Auto-play do carrossel
function autoPlay() {
    moveCarousel(1);
}

function startAutoPlay() {
    autoPlayInterval = setInterval(autoPlay, 4000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Event listeners
const carouselContainer = document.querySelector('.carousel-container');

carouselContainer.addEventListener('mouseenter', stopAutoPlay);
carouselContainer.addEventListener('mouseleave', startAutoPlay);

// Navegação por teclado
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        moveCarousel(-1);
        stopAutoPlay();
        setTimeout(startAutoPlay, 2000);
    } else if (event.key === 'ArrowRight') {
        moveCarousel(1);
        stopAutoPlay();
        setTimeout(startAutoPlay, 2000);
    }
});

// Clique nos slides para navegar
slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
        if (!slide.classList.contains('active')) {
            goToSlide(index);
            stopAutoPlay();
            setTimeout(startAutoPlay, 2000);
        }
    });
});

// Suporte para touch/swipe em dispositivos móveis
let startX = 0;
let endX = 0;

carouselContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

carouselContainer.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const threshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            moveCarousel(1); // Swipe left - próximo
        } else {
            moveCarousel(-1); // Swipe right - anterior
        }
        stopAutoPlay();
        setTimeout(startAutoPlay, 2000);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    createIndicators();
    updateCarousel();
    startAutoPlay();
}); 