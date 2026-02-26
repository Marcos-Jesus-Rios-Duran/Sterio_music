// features/testimonios/testimonios.js

/**
 * Función de inicialización que llama el Router
 */
window.initTestimonios = function () {
    console.log("🚀 Lógica de Testimonios Iniciada...");

    const stockImages = [
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
        'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'
    ];

    let testimonialsData = [
        { id: 1, name: "Diego Ramírez", rating: 5, text: "La cabina de grabación es de otro nivel. Cero latencia.", img: stockImages[0] },
        { id: 2, name: "Valeria Garza", rating: 4.5, text: "Los profes de canto son cracks. ¡Mejoré muchísimo!", img: stockImages[3] },
        { id: 3, name: "Mateo Ortiz", rating: 5, text: "Aprender guitarra aquí fue mi mejor decisión.", img: stockImages[1] },
        { id: 4, name: "Camila Mendoza", rating: 4, text: "Excelentes instalaciones y ambiente musical.", img: stockImages[2] },
        { id: 5, name: "Ricardo S.", rating: 3.5, text: "Buenos maestros, aunque el parking es pequeño.", img: stockImages[0] },
        { id: 6, name: "Sofía Luna", rating: 5, text: "¡Las jam sessions son lo mejor de la semana!", img: stockImages[1] }
    ];

    const track = document.getElementById('testimonialsGrid');
    const modal = document.getElementById('testimonialModal');
    const form = document.getElementById('testimonialForm');

    // Controles
    const btnToggleAnim = document.getElementById('btnToggleAnim');
    const btnHideAll = document.getElementById('btnHideAll');
    const scrollWrapper = document.getElementById('scrollWrapper');
    const hiddenMsg = document.getElementById('hiddenMessage');

    function getStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) stars += '<span class="material-icons-outlined">star</span>';
            else if (i - 0.5 <= rating) stars += '<span class="material-icons-outlined">star_half</span>';
            else stars += '<span class="material-icons-outlined">star_outline</span>';
        }
        return `<div class="rating-stars">${stars}</div>`;
    }

    function render() {
        if (!track) return;
        // Duplicamos para el scroll infinito
        const doubleData = [...testimonialsData, ...testimonialsData];
        track.innerHTML = doubleData.map(item => `
            <article class="testimonial-card">
                <div class="card-header" style="display:flex; gap:15px; align-items:center; margin-bottom:12px;">
                    <img src="${item.img}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid var(--primary-color)">
                    <div>
                        <h4 style="margin:0; color:var(--text-main)">${item.name}</h4>
                        ${getStars(item.rating)}
                    </div>
                </div>
                <p style="color:var(--text-gray); font-style:italic; font-size:0.9rem;">"${item.text}"</p>
            </article>
        `).join('');
        track.classList.add('scrolling-active');
    }

    // --- EVENTOS (Se ejecutan directo al llamar initTestimonios) ---

    btnToggleAnim?.addEventListener('click', () => {
        const isPaused = track.classList.toggle('animation-paused');
        document.getElementById('animIcon').textContent = isPaused ? 'play_arrow' : 'pause';
    });

    btnHideAll?.addEventListener('click', () => {
        scrollWrapper.classList.add('hidden');
        hiddenMsg.classList.remove('hidden');
    });

    document.getElementById('btnShowAll')?.addEventListener('click', () => {
        scrollWrapper.classList.remove('hidden');
        hiddenMsg.classList.add('hidden');
    });

    document.getElementById('btnOpenModal')?.addEventListener('click', () => modal.classList.remove('hidden'));
    document.getElementById('btnCloseModal')?.addEventListener('click', () => modal.classList.add('hidden'));

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newEntry = {
            id: Date.now(),
            name: document.getElementById('userName').value,
            rating: parseFloat(document.getElementById('userRating').value),
            text: document.getElementById('userComment').value,
            img: stockImages[Math.floor(Math.random() * stockImages.length)]
        };
        testimonialsData.unshift(newEntry);
        render();
        modal.classList.add('hidden');
        form.reset();
    });

    // Lanzar render inicial
    render();
};