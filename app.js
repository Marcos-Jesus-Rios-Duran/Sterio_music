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

    // Presets para cambio rápido (Usando las NUEVAS variables globales)
    presets: {
        dark: {
            '--bg': '#0a0a0c',
            '--bg-card': '#121217',
            '--bg-modal': '#1a1a1f', // Fondo del modal oscuro
            '--title': '#ffffff',
            '--text': '#d1d5db',
            '--border-card': 'rgba(255, 255, 255, 0.1)', // Borde claro para fondo oscuro
            '--text-dim': '#9ca3af'
        },
        light: {
            '--bg': '#edf4f4',
            '--bg-card': '#ffffff',
            '--bg-modal': '#f8fafc', // Fondo del modal un poco más claro que blanco
            '--title': '#0a0a0c',
            '--text': '#4b5563',
            '--border-card': 'rgba(0, 0, 0, 0.1)', // Borde oscuro para fondo claro
            '--text-dim': '#6b7280'
        }
    },

    // 1. Cambiar entre Modo Claro y Oscuro (Botón del Sol/Luna)
    toggleMode: function () {
        this.currentMode = this.currentMode === 'dark' ? 'light' : 'dark';
        this.applyPreset(this.currentMode);
        this.saveToStorage();
    },

    applyPreset: function (mode) {
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
    openPalette: function () {
        this.showModal();
    },

    showModal: function () {
        // Guardamos el estado actual por si el usuario cancela (usando variables NUEVAS)
        this.savedSettings = {
            '--primary-color': getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
            '--bg': getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),
            '--bg-card': getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim()
        };

        const modal = document.getElementById('theme-modal');
        if (modal) modal.classList.remove('hidden');
    },

    // 3. Previsualización en tiempo real
    preview: function (variable, value) {
        document.documentElement.style.setProperty(variable, value);
    },

    confirmChange: function () {
        const modal = document.getElementById('theme-modal');
        if (modal) modal.classList.add('hidden');
        this.saveToStorage();
    },

    cancelChange: function () {
        // Revertimos a los colores que guardamos al abrir el modal
        Object.keys(this.savedSettings).forEach(key => {
            document.documentElement.style.setProperty(key, this.savedSettings[key]);
        });

        const modal = document.getElementById('theme-modal');
        if (modal) modal.classList.add('hidden');
    },

    // ============================================================
    // Función para restablecer todo por defecto
    // ============================================================
    resetToDefaults: function () {
        // 1. Quitamos los estilos inyectados en el HTML (Añadidas todas las nuevas)
        const variablesToReset = [
            '--primary-color',
            '--bg',
            '--bg-card',
            '--title',
            '--text',
            '--border-card',
            '--btn-bg',
            '--btn-text'
        ];

        variablesToReset.forEach(variable => {
            document.documentElement.style.removeProperty(variable);
        });

        // 2. Borramos la memoria local
        localStorage.removeItem('stero_custom_theme');

        // 3. Forzamos el modo oscuro (por si estaban en modo claro)
        this.currentMode = 'dark';
        this.applyPreset('dark');

        // 4. Cerramos el modal
        const modal = document.getElementById('theme-modal');
        if (modal) modal.classList.add('hidden');

        console.log("SteroMusic: Tema restablecido con éxito.");
    },

    // 4. Persistencia en LocalStorage
    saveToStorage: function () {
        const config = {
            mode: this.currentMode,
            primary: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
            bg: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),
            surface: getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim()
        };
        localStorage.setItem('stero_custom_theme', JSON.stringify(config));
    },

    init: function () {
        const saved = JSON.parse(localStorage.getItem('stero_custom_theme'));
        if (saved) {
            this.currentMode = saved.mode || 'dark';

            // Aplicar el modo (Claro/Oscuro)
            this.applyPreset(this.currentMode);

            // Aplicar colores personalizados si existen (Actualizado a las nuevas variables)
            if (saved.primary) document.documentElement.style.setProperty('--primary-color', saved.primary);
            if (saved.bg) document.documentElement.style.setProperty('--bg', saved.bg);
            if (saved.surface) document.documentElement.style.setProperty('--bg-card', saved.surface);
        } else {
            // Si no hay nada guardado, forzamos el modo oscuro por defecto
            this.applyPreset('dark');
        }
    }
};

// Iniciar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => ThemeManager.init());