window.initTestimonios = function () {
    const stockImages = [
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
        'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400',
        'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400'
    ];

    // Añadimos más datos para que el carrusel circular no se quede sin contenido a la mitad
    let testimonialsData = [
        { id: 1, name: "Diego Ramírez", rating: 5, text: "La cabina de grabación es de otro nivel. Cero latencia.", img: stockImages[0] },
        { id: 2, name: "Valeria Garza", rating: 4.5, text: "Los profes de canto son cracks. ¡Mejoré muchísimo!", img: stockImages[1] },
        { id: 3, name: "Mateo Ortiz", rating: 5, text: "Aprender guitarra aquí fue mi mejor decisión.", img: stockImages[2] },
        { id: 4, name: "Camila Mendoza", rating: 4, text: "Excelentes instalaciones y ambiente musical.", img: stockImages[3] },
        { id: 5, name: "Ricardo S.", rating: 3.5, text: "Buenos maestros, aunque el parking es pequeño.", img: stockImages[4] },
        { id: 6, name: "Sofía Luna", rating: 5, text: "¡Las jam sessions son lo mejor de la semana!", img: stockImages[0] }
    ];

    const track = document.getElementById('testimonialsGrid');
    const modal = document.getElementById('testimonialModal');
    const form = document.getElementById('testimonialForm');
    const discardAlert = document.getElementById('discardAlert');

    // --- 1. Sistema de Estrellas Interactivo ---
    const starsContainer = document.getElementById('interactiveStars');
    const ratingInput = document.getElementById('ratingValue');
    const ratingDisplay = document.getElementById('ratingDisplay');
    let currentSelectedRating = 5;

    function updateStarsVisual(rating) {
        const stars = starsContainer.querySelectorAll('.star-icon');
        stars.forEach((star, idx) => {
            const starValue = idx + 1;
            if (starValue <= rating) {
                star.textContent = 'star';
            } else if (starValue - 0.5 === rating) {
                star.textContent = 'star_half';
            } else {
                star.textContent = 'star_outline';
            }
        });
        ratingDisplay.textContent = rating.toFixed(1);
    }

    starsContainer.addEventListener('mousemove', (e) => {
        if (e.target.classList.contains('star-icon')) {
            const rect = e.target.getBoundingClientRect();
            const isHalf = (e.clientX - rect.left) < (rect.width / 2);
            const index = parseInt(e.target.dataset.index);
            const hoverVal = isHalf ? index - 0.5 : index;
            updateStarsVisual(hoverVal);
        }
    });

    starsContainer.addEventListener('mouseleave', () => updateStarsVisual(currentSelectedRating));

    starsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('star-icon')) {
            const rect = e.target.getBoundingClientRect();
            const isHalf = (e.clientX - rect.left) < (rect.width / 2);
            const index = parseInt(e.target.dataset.index);
            currentSelectedRating = isHalf ? index - 0.5 : index;
            ratingInput.value = currentSelectedRating;
            updateStarsVisual(currentSelectedRating);
        }
    });

    // --- 2. Evento KeyUp: Contador ---
    const userComment = document.getElementById('userComment');
    const charCount = document.getElementById('charCount');
    userComment.addEventListener('keyup', (e) => {
        const length = e.target.value.length;
        charCount.textContent = `${length}/200 caracteres`;
        charCount.style.color = length > 200 ? '#ff4d4d' : 'gray';
    });

    // --- 3. Lógica del Modal (Cierre y Alertas) ---
    const handleCloseModal = () => {
        const hasContent = document.getElementById('userName').value || document.getElementById('userComment').value;
        if (hasContent) {
            discardAlert.classList.remove('hidden');
            // Animación Anime.js para la alerta
            anime({
                targets: '#discardAlert',
                translateY: [-10, 0],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutExpo'
            });
        } else {
            closeForce();
        }
    };

    document.getElementById('btnConfirmDiscard').onclick = (e) => {
        e.preventDefault();
        discardAlert.classList.add('hidden');
        closeForce();
    };

    document.getElementById('btnCancelDiscard').onclick = (e) => {
        e.preventDefault();
        discardAlert.classList.add('hidden');
    };

    const closeForce = () => {
        // Animación de salida con Anime.js
        anime({
            targets: '.modal-content',
            scale: [1, 0.9],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInSine',
            complete: function () {
                modal.classList.add('hidden');
                discardAlert.classList.add('hidden');
                form.reset();
                currentSelectedRating = 5;
                updateStarsVisual(5);
                charCount.textContent = "0/200 caracteres";
                // Restaurar estilos para la próxima vez
                document.querySelector('.modal-content').style.opacity = 1;
                document.querySelector('.modal-content').style.transform = 'scale(1)';
            }
        });
    };

    // ✨ Cierre haciendo clic fuera del modal (Restaurado) ✨
    modal.addEventListener('click', (e) => {
        if (e.target === modal) handleCloseModal();
    });

    // ✨ Apertura del modal con Anime.js ✨
    document.getElementById('btnOpenModal').onclick = () => {
        modal.classList.remove('hidden');
        anime({
            targets: '.modal-content',
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 400,
            easing: 'easeOutBack'
        });
    };
    document.getElementById('btnCloseModal').onclick = handleCloseModal;

    // --- 4. Visibilidad, Pausa y Títulos ---
    let isVisible = true;
    document.getElementById('btnToggleVisibility').addEventListener('click', function () {
        isVisible = !isVisible;
        const icon = document.getElementById('visibilityIcon');
        if (isVisible) {
            document.getElementById('scrollWrapper').style.display = 'block';
            document.getElementById('hiddenMessage').classList.add('hidden');
            icon.textContent = 'visibility';
        } else {
            document.getElementById('scrollWrapper').style.display = 'none';
            document.getElementById('hiddenMessage').classList.remove('hidden');
            icon.textContent = 'visibility_off';
        }
    });

    // --- Lógica del Modal para Editar Título ---
    const editTitleModal = document.getElementById('editTitleModal');
    const editTitleForm = document.getElementById('editTitleForm');
    const newTitleInput = document.getElementById('newTitleInput');
    const mainTitleNode = document.getElementById('mainTitle')

    // Abrir el modal del título con animación
    document.getElementById('btnEditTitle').onclick = function () {
        // Pre-llenamos el input con el título actual
        newTitleInput.value = mainTitleNode.textContent.trim();

        editTitleModal.classList.remove('hidden');
        anime({
            targets: editTitleModal.querySelector('.modal-content'),
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 400,
            easing: 'easeOutBack'
        });
    };

    // Función para cerrar el modal del título con animación
    const closeTitleModal = () => {
        anime({
            targets: editTitleModal.querySelector('.modal-content'),
            scale: [1, 0.9],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInSine',
            complete: function () {
                editTitleModal.classList.add('hidden');
                editTitleForm.reset();
                // Restaurar los estilos para la próxima vez
                const content = editTitleModal.querySelector('.modal-content');
                content.style.opacity = 1;
                content.style.transform = 'scale(1)';
            }
        });
    };

    // Cerrar con la 'X'
    document.getElementById('btnCloseTitleModal').onclick = closeTitleModal;

    // Cerrar al hacer clic fuera del modal
    editTitleModal.addEventListener('click', (e) => {
        if (e.target === editTitleModal) closeTitleModal();
    });

    // Guardar el nuevo título al enviar el formulario
    editTitleForm.onsubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue
        const nuevoTitulo = newTitleInput.value.trim();
        if (nuevoTitulo) {
            mainTitleNode.textContent = nuevoTitulo + " "; // Actualiza el DOM
        }
        closeTitleModal(); // Cierra el modal de forma fluida
    };


    // --- 5. Renderizado y Eliminación ---
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

    function render() {
        if (!track) return;
        // Duplicamos el arreglo para que el bucle @keyframes de CSS funcione a la perfección (-50%)
        const displaySet = [...testimonialsData, ...testimonialsData];

        track.innerHTML = displaySet.map((item, index) => `
            <article class="testimonial-card" id="card-${item.id}-${index}">
                <button class="delete-testimonial" onclick="showDeleteConfirm(${item.id}, ${index})">
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
                
                <div id="deleteConfirm-${item.id}-${index}" class="delete-overlay">
                    <p>¿Eliminar esta reseña?</p>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <button onclick="executeDelete(${item.id})" class="btn-danger-small">Sí</button>
                        <button onclick="cancelDelete(${item.id}, ${index})" class="btn-secondary-small">No</button>
                    </div>
                </div>
            </article>
        `).join('');

        track.classList.remove('scrolling-active');
        void track.offsetWidth;
        track.classList.add('scrolling-active');

        // ✨ Animación de entrada de las tarjetas con Anime.js ✨
        anime({
            targets: '.testimonial-card',
            translateY: [30, 0],
            opacity: [0, 1],
            delay: anime.stagger(100), // Aparecen una tras otra
            easing: 'easeOutElastic(1, .8)',
            duration: 800
        });
    }

    // Funciones globales para botones onclick
    window.showDeleteConfirm = (id, index) => {
        const overlay = document.getElementById(`deleteConfirm-${id}-${index}`);
        overlay.classList.add('show');
    };

    window.cancelDelete = (id, index) => {
        const overlay = document.getElementById(`deleteConfirm-${id}-${index}`);
        overlay.classList.remove('show');
    };

    window.executeDelete = (id) => {
        testimonialsData = testimonialsData.filter(t => t.id !== id);
        render(); // Al renderizar, la animación inicial se vuelve a ejecutar dándole un efecto refrescante
    };

    form.onsubmit = (e) => {
        e.preventDefault();
        testimonialsData.unshift({
            id: Date.now(),
            name: document.getElementById('userName').value,
            rating: parseFloat(document.getElementById('ratingValue').value),
            text: document.getElementById('userComment').value,
            img: stockImages[Math.floor(Math.random() * stockImages.length)]
        });
        render();
        closeForce();
    };

    render();
};