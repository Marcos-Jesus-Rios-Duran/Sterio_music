// SteroMusic/routes.js
const STERO_ROUTES = {
    "/": {
        name: "Inicio",
        template: "/features/home/home.html",
        component: "home",
        init: "initHome"
    },
    "/servicios": {
        name: "Servicios",
        template: "/features/servicios/servicios.html",
        component: "servicios"
    },
    "/servicios/instrumentos": {
        name: "Instrumentos",
        template: "/features/servicios/instrumentos.html",
        component: "servicios"
    },
    "/contacto": {
        name: "Contacto",
        template: "/features/contacto/contacto.html",
        component: "contacto"
    }
};