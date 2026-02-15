// features/registro/registro.js

window.initRegistro = function() {
    console.log("REGISTRO: Iniciando animaciones del estudio...");

    // 1. Animación Continua del Vinilo (Gira por siempre)
    anime({
        targets: '.vinyl-record',
        rotate: '1turn',
        duration: 3000,
        easing: 'linear',
        loop: true
    });

    // 2. Animación "Idle" (Reposo) del Speaker y Notas
    // El Speaker late como un corazón lento
    const speakerAnim = anime({
        targets: '.speaker-cone',
        scale: [1, 1.05],
        duration: 600,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
    });

    // Las notas flotan
    anime({
        targets: '.music-note',
        translateY: [-10, 10],
        opacity: [0.3, 0.8],
        duration: 2000,
        direction: 'alternate',
        loop: true,
        delay: anime.stagger(500),
        easing: 'easeInOutQuad'
    });

    // Las barras del ecualizador se mueven aleatoriamente
    anime({
        targets: '.bar',
        height: () => anime.random(20, 100), // Altura aleatoria
        duration: 400,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutQuad',
        delay: anime.stagger(100)
    });

    // 3. INTERACCIÓN: "Typing Beat"
    // Cuando el usuario escribe en un input, el speaker golpea fuerte
    const inputs = document.querySelectorAll('.anim-trigger');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            // Hacemos un "golpe" rápido en el speaker
            anime({
                targets: '.speaker-box',
                scale: [1, 1.02, 1],
                duration: 100,
                easing: 'easeOutQuad'
            });
            
            // Cambiamos el color del cono momentáneamente
            anime({
                targets: '.speaker-cone',
                borderColor: ['#00e5ff', '#ffffff', '#00e5ff'],
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
};