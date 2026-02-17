window.initNosotros = function() {
    console.log("NOSOTROS: Init V2 - Timeline & Grayscale Logic");

    // 1. Animación del Hero (Entrada inicial)
    anime.timeline({ easing: 'easeOutExpo' })
        .add({
            targets: '.reveal-text',
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 1200,
            delay: 300
        })
        .add({
            targets: '.hero-desc',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000
        }, '-=800');

    // 2. Observer para animar secciones al hacer scroll
    const observerOptions = {
        threshold: 0.2 // Se activa cuando el 20% del elemento es visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar Valores
                if (entry.target.classList.contains('values-grid')) {
                    anime({
                        targets: '.value-card',
                        translateY: [30, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(150),
                        duration: 800,
                        easing: 'easeOutQuad'
                    });
                    observer.unobserve(entry.target);
                }
                
                // Animar Timeline
                if (entry.target.classList.contains('timeline-container')) {
                    anime({
                        targets: '.timeline-item',
                        translateX: (el, i) => i % 2 === 0 ? [-50, 0] : [50, 0], // Izquierda o Derecha
                        opacity: [0, 1],
                        delay: anime.stagger(300),
                        duration: 1000,
                        easing: 'easeOutQuad'
                    });
                    observer.unobserve(entry.target);
                }

                // Animar Equipo (Maestros)
                if (entry.target.classList.contains('team-grid')) {
                    anime({
                        targets: '.team-card',
                        scale: [0.9, 1],
                        opacity: [0, 1],
                        delay: anime.stagger(100),
                        duration: 800,
                        easing: 'easeOutBack'
                    });
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observamos los contenedores
    const sectionsToWatch = document.querySelectorAll('.values-grid, .timeline-container, .team-grid');
    sectionsToWatch.forEach(section => {
        observer.observe(section); 
    });
};