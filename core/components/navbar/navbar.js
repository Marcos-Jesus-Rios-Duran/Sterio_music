// SteroMusic/core/components/navbar/navbar.js
// 1. BASE DE DATOS
const STERO_SEARCH_INDEX = [
    // --- GENERALES ---
    { title: "Inicio", routeName: "Inicio", category: "General", tags: "home, bienvenida, portada" },
    { title: "Nosotros", routeName: "Nosotros", category: "Institucional", tags: "historia, misión, visión, equipo, maestros" },
    { title: "Registro", routeName: "Registro", category: "Cuenta", tags: "login, sign up, usuario, crear cuenta, unirse" },
    { title: "Galería", routeName: "Galería", category: "Multimedia", tags: "fotos, videos, eventos, instalaciones, estudio" },
    { title: "Testimonios", routeName: "Testimonios", category: "Comunidad", tags: "opiniones, alumnos, reviews, experiencia" },

    // --- FACULTADES PRINCIPALES ---
    { title: "Servicios Académicos", routeName: "Servicios", category: "Servicios", tags: "clases, cursos, oferta, carreras" },
    { title: "Facultad de Instrumentos", routeName: "Instrumentos", category: "Cursos", tags: "música, ejecución, aprender a tocar" },
    { title: "Producción Musical", routeName: "Producción", category: "Cursos", tags: "audio, ingeniería, estudio de grabación" },
    { title: "Vocal Performance", routeName: "Canto", category: "Cursos", tags: "voz, canto, coro, técnica vocal, cantar" },

    // --- INSTRUMENTOS ESPECÍFICOS ---
    { title: "Piano & Teclas", routeName: "Piano", category: "Instrumentos", tags: "piano, sintetizador, jazz, clásico, teclado" },
    { title: "Guitarra & Bajo", routeName: "Guitarra", category: "Instrumentos", tags: "guitarra eléctrica, acústica, bajo, ukelele, cuerdas, rock" },
    { title: "Batería & Percusión", routeName: "Batería", category: "Instrumentos", tags: "bateria, tambores, ritmo, percusión, groove" },
    { title: "Violín & Cuerdas", routeName: "Violín", category: "Instrumentos", tags: "violin, viola, cello, contrabajo, orquesta, cuerdas frotadas" },

    // --- TEMAS DE PRODUCCIÓN  ---
    // Nota: Como no tienes rutas específicas en routes.js para 'mezcla' o 'mastering',
    // los dirigimos a la página general de "Producción" donde están las tarjetas.
    { title: "Beatmaking", routeName: "Producción", category: "Producción", tags: "beats, fl studio, ableton, composición, ritmo" },
    { title: "Mezcla (Mixing)", routeName: "Producción", category: "Producción", tags: "mezcla, mix, eq, compresión, balance" },
    { title: "Mastering", routeName: "Producción", category: "Producción", tags: "masterización, volumen, loudness, spotify" },
    { title: "DJ & Performance", routeName: "Producción", category: "Producción", tags: "dj, live set, electrónica, controladora" },
    { title: "Diseño Sonoro", routeName: "Producción", category: "Producción", tags: "foley, cine, post producción, efectos" },

    // --- EXTRAS Y SOPORTE ---
    // (Si creas una ruta de contacto en el futuro, cambia el routeName a 'Contacto')
    { title: "Contacto", routeName: "Inicio", category: "Soporte", tags: "email, telefono, ubicación, ayuda, dudas" }
];
// Variable para saber qué filtro está activo ('all' por defecto)
let currentCategoryFilter = 'all';

function initSearchSystem() {
    const input = document.getElementById('searchInput');
    const filterBtn = document.getElementById('btnFilters');
    const dropdown = document.getElementById('searchResults');
    const filtersContainer = document.getElementById('filtersContainer');
    const resultsList = document.getElementById('resultsList');

    if (!input || !dropdown) return;

    // --- A. GENERAR CHIPS DE FILTRO ---
    renderFilterChips(filtersContainer);

    // --- B. EVENTOS ---

    // 1. Click en el botón de Ajustes (Toggle)
    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que se cierre inmediatamente
        dropdown.classList.toggle('hidden');
        filtersContainer.classList.toggle('hidden'); // Muestra/Oculta los chips

        // Si abrimos y hay texto, buscamos. Si no, historial.
        if (!dropdown.classList.contains('hidden')) {
            if (input.value.trim().length > 0) {
                performSearch(input.value.trim(), resultsList);
            } else {
                showHistory(resultsList);
            }
        }
    });

    // 2. Escribir en el Input
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length > 0) {
            dropdown.classList.remove('hidden');
            performSearch(query, resultsList);
        } else {
            showHistory(resultsList);
        }
    });

    // 3. Focus en el Input
    input.addEventListener('focus', () => {
        dropdown.classList.remove('hidden');
        if (input.value.trim().length === 0) showHistory(resultsList);
    });

    // 4. Click fuera para cerrar
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) &&
            !dropdown.contains(e.target) &&
            !filterBtn.contains(e.target)) {
            dropdown.classList.add('hidden');
            filtersContainer.classList.add('hidden'); // Ocultamos filtros al cerrar
        }
    });
}

// --- FUNCIÓN PARA RENDERIZAR CHIPS ---
function renderFilterChips(container) {
    // 1. Obtener categorías únicas + 'Todo'
    const categories = ['Todo', ...new Set(STERO_SEARCH_INDEX.map(item => item.category))];

    container.innerHTML = ''; // Limpiar

    categories.forEach(cat => {
        const chip = document.createElement('button');
        chip.className = `filter-chip ${cat === 'Todo' ? 'active' : ''}`;
        chip.textContent = cat;

        chip.addEventListener('click', () => {
            // A. Visual: Cambiar clase active
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            // B. Lógica: Actualizar filtro global
            currentCategoryFilter = (cat === 'Todo') ? 'all' : cat;
            //Feedback Visual en el Botón Principa
            const mainFilterBtn = document.getElementById('btnFilters');
            if (currentCategoryFilter !== 'all') {
                mainFilterBtn.classList.add('filter-active'); // ¡Se enciende!
            } else {
                mainFilterBtn.classList.remove('filter-active'); // Se apaga
            }

            // C. Refrescar búsqueda actual
            const input = document.getElementById('searchInput');
            if (input.value.trim().length > 0) {
                performSearch(input.value.trim(), document.getElementById('resultsList'));
            }
        });

        container.appendChild(chip);
    });
}

// --- MOTOR DE BÚSQUEDA ---
function performSearch(query, container) {
    // Filtramos por TEXTO y por CATEGORÍA
    const results = STERO_SEARCH_INDEX.filter(item => {
        // 1. Coincidencia de Texto
        const textMatch = item.title.toLowerCase().includes(query) ||
            item.tags.toLowerCase().includes(query);

        // 2. Coincidencia de Categoría
        const catMatch = currentCategoryFilter === 'all' || item.category === currentCategoryFilter;

        return textMatch && catMatch;
    });

    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; color: var(--text-gray);">
                Sin resultados en "${currentCategoryFilter === 'all' ? 'Todo' : currentCategoryFilter}" 😕
            </div>`;
        return;
    }

    results.forEach(item => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `
            <span class="material-icons-outlined result-icon">north_east</span>
            <div class="result-content">
                <span class="result-category">${item.category}</span>
                <span class="result-title">${item.title}</span>
            </div>
        `;

        div.addEventListener('click', () => {
            saveToHistory(item.title);
            const search = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            searchInput.value = '';
            searchResults.classList.add('hidden');
            if (window.Router &&  typeof window.Router.getPathByName ==='function') {
                const destinationPath = window.Router.getPathByName(item.routeName);
                window.Router.navigate(destinationPath);
            }else {
                console.error("Router no encontrado. Redireccionando por defecto a Inicio.");
            }
        });

        container.appendChild(div);
    });
}

// --- HISTORIAL (Igual que antes) ---
function showHistory(container) {
    const history = JSON.parse(localStorage.getItem('stero_search_history')) || [];
    container.innerHTML = '';
    if (history.length === 0) return;

    const header = document.createElement('div');
    header.className = 'history-header';
    header.innerText = 'Recientes';
    container.appendChild(header);

    history.forEach(term => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `
            <span class="material-icons-outlined result-icon">history</span>
            <span class="result-title" style="color: var(--text-gray)">${term}</span>
        `;
        div.addEventListener('click', () => {
            const input = document.getElementById('searchInput');
            input.value = term;
            input.dispatchEvent(new Event('input'));
        });
        container.appendChild(div);
    });
}

function saveToHistory(term) {
    let history = JSON.parse(localStorage.getItem('stero_search_history')) || [];
    history = history.filter(h => h !== term);
    history.unshift(term);
    if (history.length > 5) history.pop();
    localStorage.setItem('stero_search_history', JSON.stringify(history));
}

function syncNavbarState(currentPath) {
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (currentPath === '/' && href === '/') {
            link.classList.add('active');
        } else if (href !== '/' && currentPath.startsWith(href)) {
            link.classList.add('active');
        }
    });
}

//funcion que indica el link activo en el navbar, se llama desde el router cada vez que se navega a una nueva ruta
function syncNavbarState(currentPath) {
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        // Lógica para el Home (/)
        if (currentPath === '/' && href === '/') {
            link.classList.add('active');
        }
        // Lógica para secciones: si la ruta empieza por el href del link
        // Ejemplo: si estoy en /servicios/instrumentos, resalta el link /servicios
        else if (href !== '/' && currentPath.startsWith(href)) {
            link.classList.add('active');
        }
    });
}