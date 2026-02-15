// SteroMusic/features/home/home.js

/**
 * Función de inicialización del Home.
 * Se llama desde el Router una vez que el HTML ha sido inyectado.
 */
window.initHome = function() {
    console.log("HOME: Ejecutando animaciones y lógica...");

    // ---------------------------------------------------------
    // 1. SETUP DE TEXTO (Separa las letras para animarlas)
    // ---------------------------------------------------------
    const textWrapper = document.querySelector('.brand-name');
    if (textWrapper) {
        // Truco: Limpiamos primero por si acaso se duplicaron los spans
        textWrapper.textContent = textWrapper.textContent;
        textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    }

    // ---------------------------------------------------------
    // 2. FUNCIONES INTERNAS (Carrusel 3D)
    // ---------------------------------------------------------
    function startWheelCarousel() {
        const items = document.querySelectorAll('.wheel-item');
        if (items.length === 0) return;

        let currentIndex = 0;
        const totalItems = items.length;

        // Estado inicial
        anime.set(items, { opacity: 0, translateY: '-100%', rotateX: '45deg' });
        anime.set(items[0], { opacity: 1, translateY: '0%', rotateX: '0deg' });

        // Limpiamos intervalo anterior si existiera para evitar bugs
        if (window.homeCarouselInterval) clearInterval(window.homeCarouselInterval);

        window.homeCarouselInterval = setInterval(() => {
            // Comprobar si seguimos en el home antes de animar
            if (!document.querySelector('.wheel-item')) {
                clearInterval(window.homeCarouselInterval);
                return;
            }

            const nextIndex = (currentIndex + 1) % totalItems;

            // Salida actual
            anime({
                targets: items[currentIndex],
                translateY: ['0%', '100%'],
                rotateX: ['0deg', '-45deg'],
                opacity: [1, 0],
                easing: 'easeInOutQuart',
                duration: 1200
            });

            // Entrada nueva
            anime.set(items[nextIndex], { translateY: '-100%', rotateX: '45deg', opacity: 0 });
            anime({
                targets: items[nextIndex],
                translateY: ['-100%', '0%'],
                rotateX: ['45deg', '0deg'],
                opacity: [0, 1],
                easing: 'easeInOutQuart',
                duration: 1200
            });

            currentIndex = nextIndex;
        }, 4000);
    }

    // ---------------------------------------------------------
    // 3. INTRO TIMELINE (La secuencia de entrada)
    // ---------------------------------------------------------
    // Aseguramos que anime.js existe
    if (typeof anime !== 'undefined') {
        const tl = anime.timeline({ easing: 'easeOutExpo', duration: 1000 });

        tl.add({ targets: '.glow-1, .glow-2', opacity: [0, 0.15], scale: [0.5, 1], duration: 1800, delay: anime.stagger(200) })
          .add({ targets: '.hero-content h1', opacity: [0, 1], duration: 800, easing: 'linear' }, '-=1400')
          .add({ targets: '.brand-name .letter', translateY: [40, 0], opacity: [0, 1], scale: [0.3, 1], duration: 1200, delay: anime.stagger(50) }, '-=1000')
          .add({ targets: '.hero-content p, .btn-group', translateY: [20, 0], opacity: [0, 1], duration: 800, delay: anime.stagger(200) }, '-=1000')
          .add({
              targets: '.glass-card',
              translateX: [100, 0],
              rotateY: [15, 0],
              opacity: [0, 1],
              duration: 1400,
              complete: () => startWheelCarousel() // Inicia la rueda al terminar
          }, '-=1200');
    }

    // ---------------------------------------------------------
    // 4. SCROLL Y LÍNEA (Lógica de SVG y Cards)
    // ---------------------------------------------------------
    const path = document.querySelector('.scroll-path');
    const promotionsSection = document.querySelector('.promotions-section');
    const cards = document.querySelectorAll('.promo-card');
    const sectionTitle = document.querySelector('.section-title');

    if (path && promotionsSection) {
        // Inicializar línea
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;

        let titleAnimated = false;

        // Función de scroll manejadora
        const handleScroll = () => {
            // Si ya no estamos en la página (el elemento no existe), removemos el listener
            if (!document.querySelector('.promotions-section')) {
                window.removeEventListener('scroll', handleScroll);
                return;
            }

            const rect = promotionsSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // A. Dibujar línea
            const startDraw = windowHeight * 0.8;
            const endDraw = windowHeight * 0.2;
            let percent = (startDraw - rect.top) / (startDraw - endDraw);
            percent = Math.max(0, Math.min(1, percent));
            path.style.strokeDashoffset = pathLength - (pathLength * percent);

            // B. Animar Título
            if (!titleAnimated && rect.top < windowHeight * 0.7) {
                anime({ targets: sectionTitle, opacity: [0, 1], translateY: [50, 0], duration: 1000, easing: 'easeOutExpo' });
                titleAnimated = true;
            }

            // C. Animar Cards (Cascada)
            cards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                // Verificamos si la card es visible y aún no ha sido animada (opacity 0 o vacía)
                const computedStyle = window.getComputedStyle(card);
                if (cardRect.top < windowHeight * 0.8 && computedStyle.opacity === '0') {
                    anime({
                        targets: card,
                        opacity: [0, 1],
                        translateY: [50, 0],
                        duration: 800,
                        delay: index * 150,
                        easing: 'easeOutElastic(1, .6)'
                    });
                    // Marcamos manualmente para no re-animar
                    card.style.opacity = '1';
                }
            });
        };

        // Agregamos el listener
        window.addEventListener('scroll', handleScroll);
        // Ejecutamos una vez al inicio por si ya estamos en posición
        handleScroll();
    }
};