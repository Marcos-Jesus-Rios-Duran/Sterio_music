// SteroMusic/app.js

document.addEventListener('DOMContentLoaded', async () => {
    console.log("APP: Iniciando sistema...");

    // 1. Cargar los componentes fijos (Navbar, Footer, Breadcrumb)
    // Estos no cambian nunca, así que los cargamos primero.
    await Promise.all([
        loadShellComponent('navbar-shell', '/core/components/navbar/navbar.html'),
        loadShellComponent('breadcrumb-shell', '/core/components/breadcrumb/breadcrumb.html'),
        loadShellComponent('footer-shell', '/core/components/footer/footer.html')
    ]);

    // 2. Arrancar el Router
    // Mira la URL actual y decide qué pintar en el <main>
    const currentPath = window.location.pathname;
    Router.navigate(currentPath);
});

// Función auxiliar para cargar HTMLs pequeños
async function loadShellComponent(id, url) {
    const container = document.getElementById(id);
    if (!container) return;
    try {
        const res = await fetch(url);
        container.innerHTML = await res.text();

        // Pequeño hack: Si el navbar trae su propio <script>, hay que ejecutarlo manual
        // O mejor aún, carga el navbar.js en el index.html
    } catch (err) {
        console.error(`Error cargando ${id}:`, err);
    }
}