// routes.js
const STERO_ROUTES = {
    // --- NIVEL 1: PRINCIPALES ---
    "/": {
        name: "Inicio",
        template: "/features/home/home.html",
        component: "home",
        init: "initHome"
    },
    "/nosotros": {
        name: "Nosotros",
        template: "/features/nosotros/nosotros.html",
        component: "nosotros",
        init: "initNosotros"
    },
    "/servicios": {
        name: "Servicios",
        template: "/features/servicios/servicios.html",
        component: "servicios",
        init: "initServicios"
        // Parent implícito: "/" (Inicio)
    },
    "/testimonios": {
        name: "Testimonios",
        template: "/features/testimonios/testimonios.html",
        component: "testimonios"
    },
    "/galeria": {
        name: "Galería",
        template: "/features/galeria/galeria.html",
        component: "galeria"
    },
    "/registro": {
        name: "Registro",
        template: "/features/registro/registro.html",
        component: "registro",
        init: "initRegistro"
    },

    // --- NIVEL 2: FACULTADES (Hijos de Servicios) ---
    "/instrumentos": {
        name: "Instrumentos",
        template: "/features/servicios/instrumentos/instrumentos.html",
        component: "servicios",
        init: "initInstrumentos",
        parent: "/servicios"
    },
    "/produccion": {
        name: "Producción",
        template: "/features/servicios/produccion/produccion.html",
        component: "servicios",
        parent: "/servicios"
    },
    "/canto": {
        name: "Canto",
        template: "/features/servicios/canto/canto.html",
        component: "servicios",
        parent: "/servicios"
    },

    // --- NIVEL 3: CLASES (Hijos de Instrumentos) ---
    "/piano": {
        name: "Piano",
        template: "/features/servicios/instrumentos/piano.html",
        component: "servicios",
        parent: "/instrumentos" // <--- SU PAPÁ
    },
    "/guitarra": {
        name: "Guitarra",
        template: "/features/servicios/instrumentos/guitarra.html",
        component: "servicios",
        parent: "/instrumentos"
    },
    "/bateria": {
        name: "Batería",
        template: "/features/servicios/instrumentos/bateria.html",
        component: "servicios",
        parent: "/instrumentos"
    },
    "/violin": {
        name: "Violín",
        template: "/features/servicios/instrumentos/violin.html",
        component: "servicios",
        parent: "/instrumentos"
    },

    // --- ERRORES ---
    "/404": {
        name: "Error",
        template: "/features/404/404.html",
        component: "error",
        init: "init404"
    }
};