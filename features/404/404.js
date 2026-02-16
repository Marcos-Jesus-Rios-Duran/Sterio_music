// features/404/404.js

window.init404 = function() {
    console.log("404: Shattered Vinyl Mode Active");

    // 1. Entrada Dramática del Layout
    anime.timeline({ easing: 'easeOutExpo' })
        .add({
            targets: '.broken-record-svg',
            scale: [0, 1],
            rotate: [-180, 0],
            opacity: [0, 1],
            duration: 1500
        })
        .add({
            targets: '.shattered-group',
            // Efecto sutil: las piezas del disco se separan un poco (respiran)
            scale: [1, 1.05],
            duration: 2000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutQuad'
        }, '-=500')
        .add({
            targets: '.text-col > *',
            translateX: [50, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            duration: 1000
        }, '-=1500');

    // 2. Sistema de Notas que se Rompen
    spawnBreakingNote();
};

function spawnBreakingNote() {
    // Si el usuario cambia de página, detenemos el loop para no dejar procesos fantasmas
    if (!document.querySelector('#falling-notes-container')) return;

    const container = document.getElementById('falling-notes-container');
    const note = document.createElement('div');

    // Iconos aleatorios
    const icons = ['♪', '♫', '♩', '♬'];
    note.innerText = icons[Math.floor(Math.random() * icons.length)];

    note.className = 'falling-note-item';

    // Posición aleatoria arriba del disco
    // Usamos porcentajes relativos al contenedor del disco (wrapper)
    const startX = anime.random(20, 80);
    note.style.left = `${startX}%`;
    note.style.top = '-10%';

    container.appendChild(note);

    // Animación de Caída
    anime({
        targets: note,
        top: '60%', // Cae hasta la mitad del disco aprox
        opacity: [0, 1, 1], // Aparece y se mantiene
        rotate: anime.random(-45, 45),
        duration: 1500,
        easing: 'easeInQuad',
        complete: () => {
            // AL CHOCAR:
            // 1. Ocultar nota original
            note.style.display = 'none';
            // 2. Crear explosión
            createExplosion(container, startX, 60);
            // 3. Limpiar DOM
            note.remove();
            // 4. Repetir ciclo
            setTimeout(spawnBreakingNote, anime.random(500, 1500));
        }
    });
}

function createExplosion(container, x, y) {
    // Crear 3-5 pedazos
    const particlesCount = anime.random(3, 5);

    for (let i = 0; i < particlesCount; i++) {
        const shard = document.createElement('div');
        shard.className = 'note-shard';
        shard.style.left = `${x}%`;
        shard.style.top = `${y}%`;
        // Rotación aleatoria inicial
        shard.style.transform = `rotate(${anime.random(0, 360)}deg)`;
        container.appendChild(shard);

        // Animar el pedazo saliendo disparado
        anime({
            targets: shard,
            translateX: anime.random(-30, 30), // Dispersión X
            translateY: anime.random(-20, 50), // Dispersión Y (caen)
            rotate: anime.random(0, 720), // Giran locamente
            opacity: [1, 0],
            scale: [1, 0],
            duration: anime.random(600, 1000),
            easing: 'easeOutExpo',
            complete: () => shard.remove()
        });
    }
}