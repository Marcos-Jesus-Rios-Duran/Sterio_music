window.initTestimonios = function () {
    const stockImages = [
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
        'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400',
        'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400'
    ];

    let testimonialsData = [
        { id: 1, name: "Diego Ramírez", rating: 5, text: "La cabina de grabación es de otro nivel. Cero latencia.", img: stockImages[0] },
        { id: 2, name: "Valeria Garza", rating: 4.5, text: "Los profes de canto son cracks. ¡Mejoré muchísimo!", img: stockImages[1] },
        { id: 3, name: "Mateo Ortiz", rating: 5, text: "Aprender guitarra aquí fue mi mejor decisión.", img: stockImages[2] },
        { id: 4, name: "Camila Mendoza", rating: 4, text: "Excelentes instalaciones y ambiente musical.", img: stockImages[3] },
        { id: 5, name: "Ricardo S.", rating: 3.5, text: "Buenos maestros, aunque el parking es pequeño.", img: stockImages[4] },
        { id: 6, name: "Sofía Luna", rating: 5, text: "¡Las jam sessions son lo mejor de la semana!", img: stockImages[0] },
        { id: 7, name: "Andrés K.", rating: 4.5, text: "El equipo de sonido es profesional.", img: stockImages[1] },
        { id: 8, name: "Lucía F.", rating: 4, text: "Gran ambiente para niños y adultos.", img: stockImages[2] },
        { id: 9, name: "Marcos Ríos", rating: 5, text: "SteroMusic es el futuro de la educación musical.", img: stockImages[3] },
        { id: 10, name: "Elena R.", rating: 3.5, text: "Me gustaría más variedad de horarios.", img: stockImages[4] },
        { id: 11, name: "Juan P.", rating: 4, text: "Precios accesibles para la calidad que ofrecen.", img: stockImages[0] },
        { id: 12, name: "Gaby T.", rating: 5, text: "Recomiendo el curso de producción al 100%.", img: stockImages[1] }
    ];

    const track = document.getElementById('testimonialsGrid');
    const modal = document.getElementById('testimonialModal');
    const form = document.getElementById('testimonialForm');
    let currentRating = 5;

    // --- Soporte de Estrellas (Renderizado de medias estrellas) ---
    function getStarsHTML(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<span class="material-icons-outlined">star</span>';
            } else if (i - 0.5 <= rating) {
                stars += '<span class="material-icons-outlined">star_half</span>';
            } else {
                stars += '<span class="material-icons-outlined">star_outline</span>';
            }
        }
        return `<div class="rating-stars">${stars}</div>`;
    }

    // --- Lógica del Modal y Seguridad ---
    const handleCloseModal = () => {
        const hasContent = document.getElementById('userName').value || document.getElementById('userComment').value;
        if (hasContent) {
            if (confirm("⚠️ ¿Descartar cambios? Perderás lo que has escrito.")) {
                closeForce();
            }
        } else {
            closeForce();
        }
    };

    const closeForce = () => {
        modal.classList.add('hidden');
        form.reset();
    };

    // --- Controles de Visibilidad ---
    document.getElementById('btnHideAll').addEventListener('click', function () {
        document.getElementById('scrollWrapper').classList.add('hidden');
        document.getElementById('hiddenMessage').classList.remove('hidden');
    });

    document.getElementById('btnShowAll').addEventListener('click', function () {
        document.getElementById('scrollWrapper').classList.remove('hidden');
        document.getElementById('hiddenMessage').classList.add('hidden');
    });

    // --- Renderizado y Animación ---
    function render() {
        if (!track) return;
        // Duplicamos para el scroll infinito
        const displaySet = [...testimonialsData, ...testimonialsData];

        track.innerHTML = displaySet.map(item => `
            <article class="testimonial-card">
                <button class="delete-testimonial" onclick="deleteEntry(${item.id})">
                    <span class="material-icons-outlined">delete</span>
                </button>
                <div class="card-header" style="display:flex; gap:12px; align-items:center;">
                    <img src="${item.img}" style="width:45px; height:45px; border-radius:50%; object-fit:cover;">
                    <div>
                        <h4 style="margin:0;">${item.name}</h4>
                        ${getStarsHTML(item.rating)}
                    </div>
                </div>
                <p style="margin-top:10px; font-size:0.9rem; opacity:0.8;">"${item.text}"</p>
            </article>
        `).join('');

        // Reiniciar animación
        track.classList.remove('scrolling-active');
        void track.offsetWidth; // Trigger reflow
        track.classList.add('scrolling-active');
    }

    // --- Eventos Finales ---
    document.getElementById('btnOpenModal').onclick = () => modal.classList.remove('hidden');
    document.getElementById('btnCloseModal').onclick = handleCloseModal;
    modal.onclick = (e) => { if (e.target === modal) handleCloseModal(); };

    document.getElementById('btnToggleAnim').onclick = () => {
        const isPaused = track.classList.toggle('animation-paused');
        document.getElementById('animIcon').textContent = isPaused ? 'play_arrow' : 'pause';
    };

    // Edición de título por doble click
    document.querySelector('.section-title').ondblclick = function () {
        const nuevo = prompt("Nuevo título:", this.textContent);
        if (nuevo) this.textContent = nuevo;
    };

    window.deleteEntry = (id) => {
        if (confirm("¿Eliminar reseña?")) {
            testimonialsData = testimonialsData.filter(t => t.id !== id);
            render();
        }
    };

    form.onsubmit = (e) => {
        e.preventDefault();
        testimonialsData.unshift({
            id: Date.now(),
            name: document.getElementById('userName').value,
            rating: parseFloat(document.getElementById('userRating').value),
            text: document.getElementById('userComment').value,
            img: stockImages[Math.floor(Math.random() * stockImages.length)]
        });
        render();
        closeForce();
    };

    render();
};