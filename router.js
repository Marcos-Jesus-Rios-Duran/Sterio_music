/**
 * STERO MUSIC - CORE ROUTER (Versión Hash con Lógica Parental)
 */
const Router = {
    async navigate(path) {
        // 1. Normalizamos la ruta para que siempre empiece con "/"
        // Ejemplo: "#piano" -> "/piano"
        let cleanPath = path.replace(/^#/, '');
        if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
        if (cleanPath === '/') cleanPath = '/'; // Caso base

        // Buscamos la configuración en routes.js
        const route = STERO_ROUTES[cleanPath] || STERO_ROUTES["/404"];
        
        const container = document.getElementById('main-content');
        // Seleccionamos también el breadcrumb para animarlo
        const breadcrumb = document.querySelector('.breadcrumb-wrapper'); 

        try {
            // Fetch del HTML
            const response = await fetch(route.template);
            if (!response.ok) throw new Error("Template no encontrado");
            const html = await response.text();

            // --- ANIMACIÓN DE SALIDA (Fade Out) ---
            // Ocultamos contenido y breadcrumb antes de cambiar los datos
            anime({
                targets: [container, breadcrumb],
                opacity: 0, 
                duration: 200,
                easing: 'easeInQuad',
                complete: () => {
                    // 2. CAMBIO DE CONTENIDO (Mientras está invisible)
                    container.innerHTML = html;
                    
                    // Actualizamos URL en el navegador
                    window.history.pushState({}, "", `#${cleanPath === '/' ? '' : cleanPath}`);

                    // 3. ACTUALIZAR UI (Breadcrumb + Navbar Inteligente)
                    this.updateUIComponents(cleanPath);

                    // Inicializar Scripts de la página (initHome, initNosotros, etc.)
                    if (route.init && typeof window[route.init] === 'function') {
                        window[route.init]();
                    }

                    // --- ANIMACIÓN DE ENTRADA (Fade In) ---
                    anime({ 
                        targets: [container, breadcrumb], 
                        opacity: 1, 
                        duration: 400,
                        easing: 'easeOutQuad' 
                    });
                }
            });

        } catch (err) {
            console.error("Router Error:", err);
            if (cleanPath !== '/404') this.navigate('/404');
        }
    },

    updateUIComponents(path) {
        // Llamamos al breadcrumb (que programaremos después)
        if (typeof updateBreadcrumbs === 'function') {
            updateBreadcrumbs(path);
        }
        // Llamamos al Navbar con la nueva lógica inteligente
        this.syncNavbar(path);
    },

    // --- EL CEREBRO DEL NAVBAR ---
    syncNavbar(path) {
        const links = document.querySelectorAll('.nav-links a');
        
        // Limpiamos todos los activos primero
        links.forEach(link => link.classList.remove('active'));

        // 1. Obtenemos la config de la ruta actual (ej: Piano)
        let currentRoute = STERO_ROUTES[path];

        // 2. Función recursiva para encontrar al "Abuelo" que vive en el Navbar
        const findActiveParent = (routeConfig) => {
            if (!routeConfig) return null;

            // ¿Este routeConfig tiene un link en el navbar?
            // Buscamos por el atributo data-route (ej: "Servicios")
            const matchingLink = Array.from(links).find(link => 
                link.getAttribute('data-route')?.toLowerCase() === routeConfig.name.toLowerCase()
            );

            if (matchingLink) {
                return matchingLink; // ¡Lo encontramos! Devuelve el elemento <a>
            }

            // Si no tiene link en el navbar, ¿tiene un papá?
            if (routeConfig.parent) {
                // Subimos un nivel y volvemos a buscar (Recursividad)
                return findActiveParent(STERO_ROUTES[routeConfig.parent]);
            }

            return null; // Llegamos al tope y no encontramos nada
        };

        // 3. Ejecutamos la búsqueda
        const activeLink = findActiveParent(currentRoute);

        // 4. Si encontramos un link padre (o el mismo), lo encendemos
        if (activeLink) {
            activeLink.classList.add('active');
        }
    },

    // Helper para obtener rutas por nombre (útil para clicks)
    getPathByName(nameKey) {
        for (const [path, config] of Object.entries(STERO_ROUTES)) {
            if (config.name.toLowerCase() === nameKey.toLowerCase()) {
                return path;
            }
        }
        return '/404';
    }
};

// --- LISTENERS ---
window.addEventListener('hashchange', () => {
    const path = window.location.hash.slice(1) || "/";
    Router.navigate(path);
});

window.Router = Router;

document.addEventListener('click', e => {
    // Caso 1: Click en Links del Navbar (data-route)
    const routeLink = e.target.closest('[data-route]');
    if (routeLink) {
        e.preventDefault();
        const routeName = routeLink.getAttribute('data-route');
        const path = Router.getPathByName(routeName);
        Router.navigate(path);
        return;
    } 
    
    // Caso 2: Click en links internos normales (href="/algo" data-link)
    const normalLink = e.target.closest('[data-link]'); // Asegúrate de poner data-link en tus <a>
    if (normalLink) {
        e.preventDefault();
        const href = normalLink.getAttribute('href');
        Router.navigate(href);
    }
});