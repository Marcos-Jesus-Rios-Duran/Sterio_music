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
// app.js

window.ThemeManager = {
    currentColor: '#00ffff', // Color real aplicado
    tempColor: '#00ffff',    // Color que el usuario está probando
    activeBtn: null,         // Referencia al botón que abrió la paleta

    openPalette: function (btnElement) {
        this.activeBtn = btnElement;
        let colorInput = document.getElementById('global-color-picker');

        if (!colorInput) {
            colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.id = 'global-color-picker';
            colorInput.style.display = 'none';
            document.body.appendChild(colorInput);

            // 1. Mientras el usuario mueve el cursor en la paleta
            colorInput.addEventListener('input', (e) => {
                this.tempColor = e.target.value;
                // Previsualización ligera solo en el icono del botón activo
                if (this.activeBtn) {
                    const icon = this.activeBtn.querySelector('span');
                    if (icon) icon.style.color = this.tempColor;
                }
            });

            // 2. Cuando el usuario hace click en "Aceptar" en la paleta NATIVA o la cierra
            colorInput.addEventListener('change', () => {
                this.showModal();
            });
        }

        colorInput.value = this.currentColor;
        setTimeout(() => colorInput.click(), 10);
    },

    showModal: function () {
        const modal = document.getElementById('theme-modal');
        const preview = document.getElementById('theme-preview-circle');

        preview.style.backgroundColor = this.tempColor;
        modal.classList.remove('hidden');

        // Animación de entrada (Usando anime.js que ya tienes en el proyecto)
        if (window.anime) {
            anime({
                targets: '#theme-modal .modal-content',
                scale: [0.9, 1],
                opacity: [0, 1],
                duration: 400,
                easing: 'easeOutBack'
            });
        }
    },

    // Sterio_music/app.js

    confirmChange: function () {
        this.currentColor = this.tempColor;
        document.documentElement.style.setProperty('--primary-color', this.currentColor);

        // También aplicamos a los badges por si acaso
        this.applyToBadges();

        this.closeModal();
        console.log("SteroMusic Theme Global Updated: " + this.currentColor);
    },

    cancelChange: function () {
        // Si cancela, regresamos el icono del botón al color que ya teníamos
        if (this.activeBtn) {
            const icon = this.activeBtn.querySelector('span');
            if (icon) icon.style.color = this.currentColor;
        }
        this.closeModal();
    },

    applyToBadges: function () {
        // pero lo dejamos para las clases que no usan la variable
        document.querySelectorAll('.action-badge').forEach(badge => {
            badge.style.backgroundColor = this.currentColor;
            badge.style.color = '#000';
        });
    },
    closeModal: function () {
        document.getElementById('theme-modal').classList.add('hidden');
    },

    applyToBadges: function () {
        document.querySelectorAll('.action-badge').forEach(badge => {
            badge.style.backgroundColor = this.currentColor;
            badge.style.color = '#000';
        });
    },

    onCardHover: function (card) {
        card.style.borderColor = this.currentColor;
        card.style.boxShadow = `0 20px 40px ${this.currentColor}55`;
    },

    onCardLeave: function (card) {
        card.style.borderColor = 'rgba(255,255,255,0.1)';
        card.style.boxShadow = 'none';
    }
};