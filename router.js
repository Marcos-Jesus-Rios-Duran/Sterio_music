/**
 * STERO MUSIC - CORE ROUTER
 * Maneja la navegación sin recarga de página.
 */
const Router = {
    async navigate(path) {
        const route = STERO_ROUTES[path] || STERO_ROUTES["/"];
        const container = document.getElementById('main-content');

        try {
            // A. Cargar el HTML de la página solicitada
            const response = await fetch(route.template);
            const html = await response.text();

            // B. Inyectar con una transición suave
            anime({
                targets: container,
                opacity: 0,
                duration: 200,
                easing: 'easeInOutQuad',
                complete: () => {
                    container.innerHTML = html;
                    window.history.pushState({}, "", path);

                    // C. AVISAR A OTROS COMPONENTES
                    this.updateUIComponents(path);

                    if (route.init && typeof window[route.init] === 'function') {
                        // "Si esta ruta tiene un 'init' (initHome) y existe la función, ejecútala"
                        window[route.init]();
                    }
                    anime({ targets: container, opacity: 1, duration: 400 });
                }
            });
        } catch (err) {
            console.error("Router Error:", err);
        }
    },

    updateUIComponents(path) {
        // 1. Al Breadcrumb: "Oye, actualízate con esta ruta"
        if (typeof updateBreadcrumbs === 'function') {
            updateBreadcrumbs(path); //
        }

        // 2. Al Navbar: "Píntate de azul si esta ruta te pertenece"
        this.syncNavbar(path);
    },

    syncNavbar(path) {
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            link.classList.remove('active');
            // Si el href del link coincide con la ruta actual
            if (link.getAttribute('href') === path) {
                link.classList.add('active'); // Se pone azul (Cyan)
            }
        });
    },
    /**
     * Busca la URL basada en el nombre definido en routes.js
     * Ejemplo: getPathByName('Contacto') -> retorna '/contacto'
     */
    getPathByName(nameKey) {
        // Recorremos las rutas buscando cual tiene ese 'name' o una clave personalizada
        for (const [path, config] of Object.entries(STERO_ROUTES)) {
            // Comparamos, por ejemplo, con la propiedad 'name' o una nueva 'id'
            // Truco: Para ser más exactos, podrías añadir una propiedad 'id': 'home' en routes.js
            if (config.name.toLowerCase() === nameKey.toLowerCase()) {
                return path;
            }
        }
        return '/'; // Fallback al inicio si no encuentra nada
    }
};

// Capturar clicks en enlaces para que no recarguen la página
document.addEventListener('click', e => {
    // 1. Buscamos si el click fue en un enlace con data-route
    const link = e.target.closest('[data-route]');

    if (link) {
        e.preventDefault();
        const routeName = link.getAttribute('data-route');

        // 2. Le pedimos al Router la URL real
        const path = Router.getPathByName(routeName);

        // 3. Navegamos
        Router.navigate(path);
    }
    // Mantener compatibilidad con href normales si quieres
    else if (e.target.matches('[data-link]')) {
        e.preventDefault();
        Router.navigate(e.target.getAttribute('href'));
    }
});