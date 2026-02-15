// SteroMusic/core/components/navbar/navbar.js

function syncNavbarState(currentPath) {
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        // Lógica para el Home (/)
        if (currentPath === '/' && href === '/') {
            link.classList.add('active');
        }
        // Lógica para secciones: si la ruta empieza por el href del link
        // Ejemplo: si estoy en /servicios/instrumentos, resalta el link /servicios
        else if (href !== '/' && currentPath.startsWith(href)) {
            link.classList.add('active');
        }
    });
}