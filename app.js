// SteroMusic/app.js

document.addEventListener('DOMContentLoaded', async () => {
    // 1. EL ESCENARIO: Cargamos Navbar, Breadcrumb y Footer PRIMERO
    await Promise.all([
        loadShellComponent('navbar-shell', '/core/components/navbar/navbar.html'),
        loadShellComponent('breadcrumb-shell', '/core/components/breadcrumb/breadcrumb.html'),
        loadShellComponent('footer-shell', '/core/components/footer/footer.html')
    ]);

    const currentPath = window.location.hash.slice(1) || "/";
    Router.navigate(currentPath);

    // 3. INICIALIZAR TEMA (Aseguramos que el DOM ya está listo)
    ThemeManager.init();
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
// THEME MANAGER
// ==========================================
window.ThemeManager = {
    currentMode: 'dark',
    savedSettings: {},
    controlledVars: [
        '--primary-color', 
        '--bg', 
        '--bg-card', 
        '--bg-modal', 
        '--title', 
        '--text', 
        '--text-dim', 
        '--border-card', 
        '--btn-bg', 
        '--btn-text'
    ],

    presets: {
        dark: {
            '--bg': '#0a0a0c',
            '--bg-card': '#121217',
            '--bg-modal': '#1a1a1f',
            '--title': '#ffffff',
            '--text': '#d1d5db',
            '--border-card': 'rgba(255, 255, 255, 0.1)',
            '--text-dim': '#9ca3af'
        },
        light: {
            '--bg': '#edf4f4',
            '--bg-card': '#ffffff',
            '--bg-modal': '#f8fafc',
            '--title': '#0a0a0c',
            '--text': '#4b5563',
            '--border-card': 'rgba(0, 0, 0, 0.1)',
            '--text-dim': '#6b7280'
        }
    },

    toggleMode: function () {
        this.currentMode = this.currentMode === 'dark' ? 'light' : 'dark';
        
        // Aplicamos el preset (fondos y textos base), pero respetará los colores de identidad
        // que el usuario haya definido en el panel.
        this.applyPreset(this.currentMode);
        
        this.saveToStorage();
    },

    applyPreset: function (mode) {
        const colors = this.presets[mode];
        Object.keys(colors).forEach(key => {
            document.documentElement.style.setProperty(key, colors[key]);
        });

        const icon = document.getElementById('mode-icon');
        if (icon) {
            icon.textContent = mode === 'dark' ? 'light_mode' : 'dark_mode';
        }
    },

    openPalette: function () {
        this.showModal();
    },

    showModal: function () {
        // Guardar estado actual por si se cancela
        this.controlledVars.forEach(variable => {
            this.savedSettings[variable] = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
        });

        const modal = document.getElementById('theme-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.syncInputs();
        }
    },

    syncInputs: function() {
        const modal = document.getElementById('theme-modal');
        const inputs = modal.querySelectorAll('input[type="color"]');
        
        inputs.forEach(input => {
            const oninputAttr = input.getAttribute('oninput');
            const match = oninputAttr.match(/'(--[a-zA-Z0-9-]+)'/);
            if (match && match[1]) {
                const variableName = match[1];
                let colorHex = this.savedSettings[variableName];
                
                if(colorHex && colorHex.startsWith('#') && (colorHex.length === 4 || colorHex.length === 7)) {
                   input.value = colorHex;
                }
            }
        });
    },

    preview: function (variable, value) {
        if(variable === '--primary-color') {
            document.documentElement.style.setProperty('--btn-bg', value);
            const btnInput = document.querySelector('input[oninput*="--btn-bg"]');
            if(btnInput) btnInput.value = value;
        }
        document.documentElement.style.setProperty(variable, value);
    },

    confirmChange: function () {
        const modal = document.getElementById('theme-modal');
        if (modal) modal.classList.add('hidden');
        this.saveToStorage(); 
    },

    cancelChange: function () {
        // Si descarta, restauramos las variables al momento antes de abrir el modal
        Object.keys(this.savedSettings).forEach(key => {
            if(this.savedSettings[key]) {
               document.documentElement.style.setProperty(key, this.savedSettings[key]);
            }
        });

        const modal = document.getElementById('theme-modal');
        if (modal) modal.classList.add('hidden');
    },

    resetToDefaults: function () {
        // Limpia el estilo en línea (el DOM)
        this.controlledVars.forEach(variable => {
            document.documentElement.style.removeProperty(variable);
        });

        // Limpia la memoria caché
        localStorage.removeItem('stero_custom_theme');
        
        // Vuelve al modo oscuro o claro pero con sus valores de fábrica
        this.applyPreset(this.currentMode);

        const modal = document.getElementById('theme-modal');
        if (modal) modal.classList.add('hidden');
    },

    saveToStorage: function () {
        const config = { mode: this.currentMode };
        
        // Solo guardamos los valores que se aplicaron explícitamente en el DOM style
        // para no "ensuciar" el localStorage con colores fijos si no hace falta
        this.controlledVars.forEach(variable => {
            const val = document.documentElement.style.getPropertyValue(variable).trim();
            if(val) config[variable] = val;
        });
        
        localStorage.setItem('stero_custom_theme', JSON.stringify(config));
    },

    init: function () {
        const saved = JSON.parse(localStorage.getItem('stero_custom_theme'));
        
        // 1. Cargamos el modo base primero (default dark)
        this.currentMode = saved && saved.mode ? saved.mode : 'dark';
        this.applyPreset(this.currentMode);

        // 2. Si el usuario guardó colores personalizados, los inyectamos sobre el preset
        if (saved) {
            requestAnimationFrame(() => {
                this.controlledVars.forEach(variable => {
                    if (saved[variable] && variable !== 'mode') {
                        document.documentElement.style.setProperty(variable, saved[variable]);
                    }
                });
            });
        }
    }
};