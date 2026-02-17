// SteroMusic/app.js

document.addEventListener('DOMContentLoaded', async () => {
    // 1. EL ESCENARIO: Cargamos Navbar, Breadcrumb y Footer PRIMERO
    // Usamos Promise.all para que carguen en paralelo (es más rápido)
    await Promise.all([
        loadShellComponent('navbar-shell', '/core/components/navbar/navbar.html'),
        loadShellComponent('breadcrumb-shell', '/core/components/breadcrumb/breadcrumb.html'),
        loadShellComponent('footer-shell', '/core/components/footer/footer.html')
    ]);

    // 2. EL ACTOR: Ahora que el HTML existe, el Router puede navegar
    // y actualizar el Breadcrumb correctamente sin parpadeos.
    const currentPath = window.location.hash.slice(1) || "/";
    Router.navigate(currentPath);
});

// Función auxiliar para cargar HTMLs pequeños
async function loadShellComponent(id, url) {
    const container = document.getElementById(id);
    if (!container) return;
    try {
        const res = await fetch(url);
        container.innerHTML = await res.text();
        if (id === 'navbar-shell' && typeof initSearchSystem === 'function') {
            initSearchSystem();
        }
    } catch (err) {
        console.error(`Error cargando ${id}:`, err);
    }
}