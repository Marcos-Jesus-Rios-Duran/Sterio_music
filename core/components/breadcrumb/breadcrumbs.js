// SteroMusic/core/components/breadcrumb/breadcrumbs.js

function updateBreadcrumbs(manualPath) {
    const listContainer = document.getElementById('breadcrumb-container-list');
    
    // Importante: Si el componente HTML aún no cargó (por latencia del fetch en app.js), salimos.
    if (!listContainer) return;

    const path = manualPath || window.location.pathname;

    // --- CASO 1: ESTAMOS EN EL HOME (/) ---
    if (path === '/' || path === '' || path === '/index.html') {
        listContainer.innerHTML = `
            <li class="breadcrumb-item active">
                <span class="material-icons-outlined breadcrumb-icon">home</span>
                Inicio
            </li>
        `;
        return; // Terminamos aquí, no hay nada más que pintar
    }

    // --- CASO 2: ESTAMOS EN UNA SECCIÓN INTERNA ---
    // 1. Empezamos poniendo la Casita como enlace (Gris)
    let breadcrumbHTML = `
        <li class="breadcrumb-item">
            <a href="/" data-link>
                <span class="material-icons-outlined breadcrumb-icon">home</span>
                Inicio
            </a>
            <span class="breadcrumb-separator">›</span>
        </li>
    `;

    // 2. Desglosamos la ruta (ej: /servicios/instrumentos)
    const segments = path.split('/').filter(s => s !== "");
    let pathAccumulator = "";

    segments.forEach((segment, index) => {
        pathAccumulator += `/${segment}`;
        const isLast = index === segments.length - 1;
        
        // CORRECCIÓN: Accedemos a .name para que no salga [object Object]
        // Si la ruta no existe en routes.js, usamos el segmento capitalizado como fallback
        const routeConfig = STERO_ROUTES[pathAccumulator];
        const displayName = routeConfig ? routeConfig.name : (segment.charAt(0).toUpperCase() + segment.slice(1));

        if (isLast) {
            // El último elemento es texto plano y AZUL (active)
            breadcrumbHTML += `
                <li class="breadcrumb-item active" aria-current="page">
                    ${displayName}
                </li>`;
        } else {
            // Los intermedios son enlaces
            breadcrumbHTML += `
                <li class="breadcrumb-item">
                    <a href="${pathAccumulator}" data-link>${displayName}</a>
                    <span class="breadcrumb-separator">›</span>
                </li>`;
        }
    });

    listContainer.innerHTML = breadcrumbHTML;

    // Animación suave al actualizar
    anime({
        targets: '.breadcrumb-item',
        opacity: [0, 1],
        translateX: [-10, 0],
        duration: 400,
        easing: 'easeOutQuad',
        delay: anime.stagger(50)
    });
}