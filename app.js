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
// ==========================================
// THEME MANAGER (Cumpliendo el principio DRY)
// ==========================================
window.ThemeManager = {
    currentMode: 'dark',
    savedSettings: {},

    // Presets para cambio rápido (Tus colores de React para el modo claro)
    presets: {
        dark: {
            '--bg-dark': '#0a0a0c',
            '--surface-dark': '#121217',
            '--text-main': '#ffffff',
            '--text-gray': '#d1d5db'
        },
        light: {
            '--bg-dark': '#edf4f4',
            '--surface-dark': '#ffffff',
            '--text-main': '#0a0a0c',
            '--text-gray': '#4b5563'
        }
    },

    // 1. Cambiar entre Modo Claro y Oscuro (Botón del Sol/Luna)
    toggleMode: function() {
        this.currentMode = this.currentMode === 'dark' ? 'light' : 'dark';
        this.applyPreset(this.currentMode);
        this.saveToStorage();
    },

    applyPreset: function(mode) {
        const colors = this.presets[mode];
        Object.keys(colors).forEach(key => {
            document.documentElement.style.setProperty(key, colors[key]);
        });

        // Actualizar el icono del botón en el Navbar
        const icon = document.getElementById('mode-icon');
        if (icon) {
            icon.textContent = mode === 'dark' ? 'light_mode' : 'dark_mode';
        }
    },

    // 2. Abrir Panel de Personalización (Botón de Paleta)
    // Se llama openPalette porque así lo tienes en el HTML del navbar
    openPalette: function() {
        this.showModal();
    },

    showModal: function() {
        // Guardamos el estado actual por si el usuario cancela
        this.savedSettings = {
            '--primary-color': getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
            '--bg-dark': getComputedStyle(document.documentElement).getPropertyValue('--bg-dark').trim(),
            '--surface-dark': getComputedStyle(document.documentElement).getPropertyValue('--surface-dark').trim()
        };

        const modal = document.getElementById('theme-modal');
        if (modal) modal.classList.remove('hidden');
    },

    // 3. Previsualización en tiempo real
    preview: function(variable, value) {
        document.documentElement.style.setProperty(variable, value);
    },

    confirmChange: function() {
        const modal = document.getElementById('theme-modal');
        if (modal) modal.classList.add('hidden');
        this.saveToStorage();
    },

    cancelChange: function() {
        // Revertimos a los colores que guardamos al abrir el modal
        Object.keys(this.savedSettings).forEach(key => {
            document.documentElement.style.setProperty(key, this.savedSettings[key]);
        });

        const modal = document.getElementById('theme-modal');
        if (modal) modal.classList.add('hidden');
    },

    // 4. Persistencia en LocalStorage
    saveToStorage: function() {
        const config = {
            mode: this.currentMode,
            primary: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
            bg: getComputedStyle(document.documentElement).getPropertyValue('--bg-dark').trim(),
            surface: getComputedStyle(document.documentElement).getPropertyValue('--surface-dark').trim()
        };
        localStorage.setItem('stero_custom_theme', JSON.stringify(config));
    },

    init: function() {
        const saved = JSON.parse(localStorage.getItem('stero_custom_theme'));
        if (saved) {
            this.currentMode = saved.mode || 'dark';

            // Aplicar el modo (Claro/Oscuro)
            this.applyPreset(this.currentMode);

            // Aplicar colores personalizados si existen
            if (saved.primary) document.documentElement.style.setProperty('--primary-color', saved.primary);
            if (saved.bg) document.documentElement.style.setProperty('--bg-dark', saved.bg);
            if (saved.surface) document.documentElement.style.setProperty('--surface-dark', saved.surface);
        } else {
            // Si no hay nada guardado, forzamos el modo oscuro por defecto
            this.applyPreset('dark');
        }
    }
};

// Iniciar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => ThemeManager.init());