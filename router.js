/**
 * STERO MUSIC - CORE ROUTER (Versión Hash)
 */
const Router = {
    async navigate(path) {
        // Limpiamos el path por si viene con / o # accidentales
        const cleanPath = path.replace(/^#?\/?/, '') || "/";
        const route = STERO_ROUTES[cleanPath] || STERO_ROUTES["/"];
        
        const container = document.getElementById('main-content');
        const breadcrumb = document.querySelector('.breadcrumb-wrapper');

        try {
            const response = await fetch(route.template);
            if (!response.ok) {
                if (cleanPath === '404') {
                    container.innerHTML = "<h1>Error Crítico: Falta el archivo 404.html</h1>";
                    return;
                }
                this.navigate('404');
                return;
            }
            const html = await response.text();

            anime({
                targets: [container, breadcrumb],
                opacity: 1, // Bajamos opacidad antes de cambiar
                duration: 200,
                easing: 'easeInOutQuad',
                complete: () => {
                    container.innerHTML = html;
                    
                    // CAMBIO AQUÍ: Ahora guardamos con Hash
                    window.history.pushState({}, "", `#${cleanPath === '/' ? '' : cleanPath}`);

                    this.updateUIComponents(cleanPath);

                    if (route.init && typeof window[route.init] === 'function') {
                        window[route.init]();
                    }
                    anime({ targets: container, opacity: 1, duration: 400 });
                }
            });
        } catch (err) {
            console.error("Router Error:", err);
            if (cleanPath !== '404') this.navigate('404');
        }
    },

    updateUIComponents(path) {
        if (typeof updateBreadcrumbs === 'function') {
            updateBreadcrumbs(path);
        }
        this.syncNavbar(path);
    },

    syncNavbar(path) {
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            link.classList.remove('active');
            const routeName = link.getAttribute('data-route');
            if (routeName) {
                const linkPath = this.getPathByName(routeName).replace('/', '');
                if (linkPath === path.replace('/', '')) {
                    link.classList.add('active');
                }
            }
        });
    },

    getPathByName(nameKey) {
        for (const [path, config] of Object.entries(STERO_ROUTES)) {
            if (config.name.toLowerCase() === nameKey.toLowerCase()) {
                return path;
            }
        }
        return '404';
    }
};

// --- BOTÓN ATRÁS Y ADELANTE ---
window.addEventListener('hashchange', () => {
    // Obtenemos el fragmento después del #
    const path = window.location.hash.slice(1) || "/";
    Router.navigate(path);
});

window.Router = Router;

// Captura de clicks
document.addEventListener('click', e => {
    const link = e.target.closest('[data-route]');
    if (link) {
        e.preventDefault();
        const path = Router.getPathByName(link.getAttribute('data-route'));
        Router.navigate(path);
    } else if (e.target.matches('[data-link]')) {
        e.preventDefault();
        Router.navigate(e.target.getAttribute('href'));
    }
});