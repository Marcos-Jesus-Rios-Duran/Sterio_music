/* Archivo: Sterio_music/core/components/breadcrumb/breadcrumbs.js */

function updateBreadcrumbs(manualPath) {
    const listContainer = document.getElementById('breadcrumb-container-list');
    const wrapper = document.querySelector('.breadcrumb-wrapper');
    
    // Validación de seguridad
    if (!listContainer || !wrapper) return;

    // 1. OBTENER RUTA LIMPIA
    // Si viene manualPath (del router) lo usamos, si no leemos el hash
    let path = manualPath || window.location.hash.slice(1) || "/";
    // Aseguramos que empiece con /
    if (!path.startsWith('/')) path = '/' + path;

    let breadcrumbHTML = '';

    // --- CASO 1: ESTAMOS EN EL HOME ---
    if (path === '/') {
        // Solo mostramos la casita (sin texto) y activa
        breadcrumbHTML = `
            <li class="breadcrumb-item active">
                <span class="material-icons-outlined breadcrumb-icon" style="margin: 0; font-size: 1.3rem;">home</span>
            </li>
        `;
    } else {
        // --- CASO 2: PÁGINAS INTERNAS ---
        
        // A. Primero ponemos la Casita con enlace al inicio (Sin texto "Inicio")
        breadcrumbHTML = `
            <li class="breadcrumb-item">
                <a href="#" onclick="Router.navigate('/')" aria-label="Ir al Inicio">
                    <span class="material-icons-outlined breadcrumb-icon" style="margin: 0; font-size: 1.3rem;">home</span>
                </a>
                <span class="breadcrumb-separator">›</span>
            </li>
        `;

        // B. Lógica Inteligente: Construimos el camino hacia atrás usando "parents"
        let trail = [];
        let pointer = path;

        // Mientras la ruta exista en tu configuración...
        while (pointer && STERO_ROUTES[pointer]) {
            const config = STERO_ROUTES[pointer];
            
            // Agregamos al inicio del arreglo (unshift) para que quede: Abuelo -> Padre -> Hijo
            trail.unshift({
                path: pointer,
                name: config.name
            });

            // Saltamos al padre para la siguiente vuelta
            pointer = config.parent; 
        }

        // Fallback: Si la ruta no está en routes.js (ej. un error 404 raro), mostramos algo básico
        if (trail.length === 0) {
             const segment = path.split('/').pop();
             trail.push({ path: path, name: segment.charAt(0).toUpperCase() + segment.slice(1) });
        }

        // C. Renderizamos los pasos intermedios
        trail.forEach((step, index) => {
            const isLast = index === trail.length - 1;

            if (isLast) {
                // El último paso es texto plano (página actual)
                breadcrumbHTML += `
                    <li class="breadcrumb-item active" aria-current="page">
                        ${step.name}
                    </li>`;
            } else {
                // Los pasos intermedios son enlaces
                breadcrumbHTML += `
                    <li class="breadcrumb-item">
                        <a href="#" onclick="Router.navigate('${step.path}')">${step.name}</a>
                        <span class="breadcrumb-separator">›</span>
                    </li>`;
            }
        });
    }

    // --- PASO 3: INYECCIÓN ---
    listContainer.innerHTML = breadcrumbHTML;
}