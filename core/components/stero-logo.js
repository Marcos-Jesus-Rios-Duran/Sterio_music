/**
 * @class SteroLogo
 * @extends HTMLElement
 * * Un componente web personalizado que renderiza un logotipo animado tipo ecualizador.
 * Utiliza Shadow DOM para el encapsulamiento y la librería anime.js para las animaciones.
 * * @example
 * <stero-logo size="60px" color="#ff0000"></stero-logo>
 */
class SteroLogo extends HTMLElement {

    constructor() {
        super();
        /** @type {ShadowRoot} */
        this.attachShadow({ mode: 'open' });
    }

    /**
     * Ciclo de vida: Invocado cuando el componente se añade al DOM.
     * Configura los estilos, la estructura SVG y gestiona la carga de la animación.
     */
    connectedCallback() {
        // Obtención de atributos personalizados con valores por defecto (Default Fallbacks)
        const size = this.getAttribute('size') || '45px';
        const color = this.getAttribute('color') || 'var(--primary-color, #00e5ff)';

        // Inyección de estilos CSS y estructura SVG en el Shadow DOM
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    vertical-align: middle;
                    line-height: 0;
                }
                svg {
                    width: ${size};
                    height: ${size};
                    overflow: visible; /* Permite que las barras escalen sin recortarse */
                }
                .bar {
                    fill: ${color};
                    transform-origin: bottom; /* Punto de anclaje para que la escala crezca hacia arriba */
                }
            </style>

            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect class="bar b1" x="15" y="45" width="20" height="35" rx="3" />
                <rect class="bar b2" x="40" y="20" width="20" height="60" rx="3" />
                <rect class="bar b3" x="65" y="35" width="20" height="45" rx="3" />
            </svg>
        `;

        /**
         * GESTIÓN DE DEPENDENCIAS EXTERNAS (anime.js)
         * El componente depende de que 'anime.js' esté disponible globalmente en el objeto 'window'.
         */
        if (window.anime) {
            // Caso 1: La librería ya está cargada en el navegador.
            this.animateEqualizer();
        } else {
            /** * Caso 2: Mecanismo de reintento.
             * Si el script de anime.js se carga de forma asíncrona o después de este componente,
             * esperamos 500ms antes de intentar disparar la animación para evitar errores de 'undefined'.
             */
            setTimeout(() => {
                if (window.anime) {
                    this.animateEqualizer();
                } else {
                    console.warn('SteroLogo: anime.js no detectado. La animación no se ejecutará.');
                }
            }, 500);
        }
    }

    /**
     * Define y ejecuta la línea de tiempo de la animación para cada barra del SVG.
     * Se utilizan diferentes duraciones y curvas de suavizado (easing) para simular
     * una respuesta de audio orgánica.
     * @private
     */
    animateEqualizer() {
        const bars = this.shadowRoot.querySelectorAll('.bar');

        // Animación de la Barra 1 (Izquierda)
        anime({
            targets: bars[0],
            scaleY: [0.4, 1.2],
            duration: 400,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
        });

        // Animación de la Barra 2 (Centro)
        anime({
            targets: bars[1],
            scaleY: [0.5, 1.0],
            duration: 550,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutQuad'
        });

        // Animación de la Barra 3 (Derecha)
        anime({
            targets: bars[2],
            scaleY: [0.3, 1.3],
            duration: 450,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
        });
    }
}

// Registro del Custom Element en el navegador
customElements.define('stero-logo', SteroLogo);