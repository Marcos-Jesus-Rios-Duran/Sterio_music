// features/404/404.js

window.init404 = function() {
    console.log("404: Iniciando secuencia de error...");

    // 1. Animación de Entrada de Elementos
    const tl = anime.timeline({ easing: 'easeOutExpo', duration: 1000 });

    tl.add({
        targets: '.broken-record-container',
        scale: [0, 1],
        rotate: '1turn',
        opacity: [0, 1],
        duration: 1200
    })
    .add({
        targets: '.crack-line',
        strokeDashoffset: [anime.setDashoffset, 0],
        opacity: [0, 1],
        easing: 'easeInOutSine',
        duration: 500,
        delay: anime.stagger(200) // Aparecen una por una las grietas
    }, '-=600')
    .add({
        targets: '.error-title, .error-subtitle, .btn-group-center',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100)
    }, '-=400');

    // 2. Loop: Disco "Glitch" (Intenta girar pero se traba)
    anime({
        targets: '.broken-record',
        rotate: [0, 5, 0, -5], // Pequeña vibración
        duration: 200,
        direction: 'alternate',
        loop: true,
        easing: 'steps(2)', // Movimiento robótico
        delay: 2000 // Empieza después de la entrada
    });

    // 3. Loop: Nota Musical Cayendo (Llorando)
    anime({
        targets: '.falling-note',
        translateY: [0, 100],
        translateX: [0, 20],
        opacity: [1, 0],
        rotate: '45deg',
        duration: 2000,
        loop: true,
        easing: 'easeInQuad'
    });
};