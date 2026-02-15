// SteroMusic/core/components/breadcrumb/breadcrumbs.js
function updateBreadcrumbs(manualPath) {
    const listContainer = document.getElementById('breadcrumb-container-list');
    if (!listContainer) return;

    // Usamos la ruta que nos da el Router o la actual del navegador
    const path = manualPath || window.location.pathname;
    const segments = path.split('/').filter(s => s !== "");

    let breadcrumbHTML = `
        <li class="breadcrumb-item">
            <a href="/" data-link>
                <span class="material-icons-outlined breadcrumb-icon">home</span>
                Inicio
            </a>
            <span class="breadcrumb-separator">›</span>
        </li>
    `;

    // 4. Construir el resto del camino
    let pathAccumulator = "";
    segments.forEach((segment, index) => {
        pathAccumulator += `/${segment}`;
        const isLast = index === segments.length - 1;
        const displayName = STERO_ROUTES[pathAccumulator] || segment;

        if (isLast) {
            breadcrumbHTML += `
                <li class="breadcrumb-item active" aria-current="page">
                    ${displayName}
                </li>`;
        } else {
            breadcrumbHTML += `
                <li class="breadcrumb-item">
                    <a href="${pathAccumulator}.html">${displayName}</a>
                    <span class="breadcrumb-separator">›</span>
                </li>`;
        }
    });

    listContainer.innerHTML = breadcrumbHTML;

    // 5. Animación de entrada con anime.js
    anime({
        targets: '.breadcrumb-item',
        opacity: [0, 1],
        translateX: [-10, 0],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeOutExpo'
    });
}

// Ejecutar cuando el loader termine de inyectar el HTML
// window.addEventListener('load', updateBreadcrumbs);