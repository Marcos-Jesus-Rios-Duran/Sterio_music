/* Archivo: Sterio_music/core/components/breadcrumb/breadcrumbs.js */

function updateBreadcrumbs(manualPath) {
    const listContainer = document.getElementById('breadcrumb-container-list');
    const wrapper = document.querySelector('.breadcrumb-wrapper');
    
    // Validación de seguridad
    if (!listContainer || !wrapper) return;


    // --- PASO 2: LÓGICA DE CONSTRUCCIÓN HTML (Tu código original) ---
    const path = manualPath || window.location.pathname;
    let breadcrumbHTML = '';

    if (path === '/' || path === '' || path === '/index.html') {
        // CASO HOME
        breadcrumbHTML = `
            <li class="breadcrumb-item active">
                <span class="material-icons-outlined breadcrumb-icon">home</span>
                Inicio
            </li>
        `;
    } else {
        // CASO INTERNO
        breadcrumbHTML = `
            <li class="breadcrumb-item">
                <a href="/" data-link>
                    <span class="material-icons-outlined breadcrumb-icon">home</span>
                    Inicio
                </a>
                <span class="breadcrumb-separator">›</span>
            </li>
        `;

        const segments = path.split('/').filter(s => s !== "");
        let pathAccumulator = "";

        segments.forEach((segment, index) => {
            pathAccumulator += `/${segment}`;
            const isLast = index === segments.length - 1;
            
            const routeConfig = STERO_ROUTES[pathAccumulator];
            const displayName = routeConfig ? routeConfig.name : (segment.charAt(0).toUpperCase() + segment.slice(1));

            if (isLast) {
                breadcrumbHTML += `
                    <li class="breadcrumb-item active" aria-current="page">
                        ${displayName}
                    </li>`;
            } else {
                breadcrumbHTML += `
                    <li class="breadcrumb-item">
                        <a href="${pathAccumulator}" data-link>${displayName}</a>
                        <span class="breadcrumb-separator">›</span>
                    </li>`;
            }
        });
    }

    // --- PASO 3: INYECCIÓN DE CONTENIDO ---
    // En este punto, el wrapper es invisible (opacity: 0), así que nadie ve el cambio brusco.
    listContainer.innerHTML = breadcrumbHTML;
}