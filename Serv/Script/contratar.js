let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

// Dados dos Skill Pods
const skillPodsData = [
  {
    title: "Skill Pod Web",
    image: "Assets/dev_front.png",
    description: "Equipe especializada em desenvolvimento web completo, desde o front-end até o back-end, garantindo soluções digitais modernas e eficientes.",
    professionals: [
      "Desenvolvedor Front-end Senior",
      "Desenvolvedor Back-end Senior",
      "DevOps Engineer",
      "UI/UX Designer"
    ],
    benefits: [
      "Desenvolvimento ágil e eficiente",
      "Código limpo e bem documentado",
      "Suporte contínuo",
      "Garantia de qualidade"
    ]
  },
  {
    title: "Skill Pod Design",
    image: "Assets/design_grafico.png",
    description: "Time criativo focado em design gráfico e identidade visual, transformando ideias em designs impactantes e memoráveis.",
    professionals: [
      "Designer Gráfico Senior",
      "UI/UX Designer",
      "Ilustrador Digital",
      "Motion Designer"
    ],
    benefits: [
      "Designs únicos e personalizados",
      "Identidade visual consistente",
      "Artes para todas as plataformas",
      "Revisões ilimitadas"
    ]
  },
  {
    title: "Skill Pod Marketing",
    image: "Assets/marketing_dig.png",
    description: "Equipe de marketing digital completa, especializada em estratégias de crescimento e engajamento nas redes sociais.",
    professionals: [
      "Social Media Manager",
      "Content Creator",
      "Analista de Marketing Digital",
      "Copywriter"
    ],
    benefits: [
      "Estratégias personalizadas",
      "Análise de métricas",
      "Conteúdo otimizado",
      "Gestão de comunidade"
    ]
  },
  {
    title: "Skill Pod Consultoria",
    image: "Assets/consultoria.png",
    description: "Time de consultores especializados em diferentes áreas, oferecendo soluções estratégicas para seu negócio.",
    professionals: [
      "Consultor de Negócios",
      "Analista Financeiro",
      "Especialista em Processos",
      "Consultor de RH"
    ],
    benefits: [
      "Análise completa do negócio",
      "Plano de ação detalhado",
      "Acompanhamento contínuo",
      "Resultados mensuráveis"
    ]
  },
  {
    title: "Skill Pod Construção",
    image: "Assets/pintor.png",
    description: "Equipe completa para projetos de construção, desde a pintura até acabamentos finais, com qualidade e pontualidade.",
    professionals: [
      "Mestre de Obras",
      "Pintor Profissional",
      "Ajudante de Construção",
      "Especialista em Acabamentos"
    ],
    benefits: [
      "Materiais de qualidade",
      "Trabalho garantido",
      "Limpeza após serviço",
      "Orçamento transparente"
    ]
  },
  {
    title: "Skill Pod Reformas",
    image: "Assets/pedreiro.png",
    description: "Time especializado em reformas e manutenção, oferecendo soluções completas para sua residência ou empresa.",
    professionals: [
      "Pedreiro Especialista",
      "Eletricista",
      "Encanador",
      "Ajudante de Obras"
    ],
    benefits: [
      "Orçamento detalhado",
      "Prazo cumprido",
      "Garantia do serviço",
      "Suporte pós-obra"
    ]
  }
];

// Funções principais do carrossel
function updateCarousel() {
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev', 'next');
        
        if (index === currentSlide) {
            slide.classList.add('active');
        } else if (index === (currentSlide - 1 + totalSlides) % totalSlides) {
            slide.classList.add('prev');
        } else if (index === (currentSlide + 1) % totalSlides) {
            slide.classList.add('next');
        }
    });
    
    updateIndicators();
}

function moveCarousel(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

// Indicadores
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

// Auto-play simplificado
let autoPlayInterval = setInterval(() => moveCarousel(1), 4000);

// Event listeners
const carouselContainer = document.querySelector('.carousel-container');

carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
carouselContainer.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(() => moveCarousel(1), 4000);
});

// Navegação por teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') moveCarousel(-1);
    if (event.key === 'ArrowRight') moveCarousel(1);
    if (event.key === 'Escape') closePopup();
});

// Suporte para touch/swipe
let startX = 0;
carouselContainer.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
carouselContainer.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) moveCarousel(diff > 0 ? 1 : -1);
});

// Funções do popup
function showPopup(index) {
    const data = skillPodsData[index];
    const popup = document.getElementById('carouselPopup');
    
    document.getElementById('popupImage').src = data.image;
    document.getElementById('popupTitle').textContent = data.title;
    document.getElementById('popupDescription').textContent = data.description;
    
    document.getElementById('popupProfessionals').innerHTML = 
        data.professionals.map(p => `<li>${p}</li>`).join('');
    
    document.getElementById('popupBenefits').innerHTML = 
        data.benefits.map(b => `<li>${b}</li>`).join('');
    
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    document.getElementById('carouselPopup').classList.remove('active');
    document.body.style.overflow = '';
}

// Fechar popup ao clicar fora
document.getElementById('carouselPopup').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closePopup();
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    createIndicators();
    updateCarousel();
}); 