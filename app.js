// SteroMusic/app.js

document.addEventListener('DOMContentLoaded', async () => {
// 1. EL SOLISTA: Cargar el contenido principal inmediatamente
    const currentPath = window.location.pathname;
    Router.navigate(currentPath);

    // 2. EL ACOMPAÑAMIENTO: Cargamos el resto después de que el main inició
    // Usamos un pequeño timeout para dar respiro al procesador
    setTimeout(() => {
        loadShellComponent('navbar-shell', '/core/components/navbar/navbar.html');
        loadShellComponent('breadcrumb-shell', '/core/components/breadcrumb/breadcrumb.html');
        loadShellComponent('footer-shell', '/core/components/footer/footer.html');
    }, 100);

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