// SteroMusic/routes.js
const STERO_ROUTES = {
    "/": {
        name: "Inicio",
        template: "/features/home/home.html",
        component: "home",
        init: "initHome"
    },
    "nosotros":{
        name:"Nosotros",
        template:"/features/nosotros/nosotros.html",
        component:"nosotros",
        init:"initNosotros"
    },
    "registro": {
        name: "Registro",
        template: "/features/registro/registro.html",
        component: "registro",
        init: "initRegistro" // ¡Importante para que cargue el JS!
    },
    "servicios": {
        name: "Servicios",
        template: "/features/servicios/servicios.html",
        component: "servicios"
    },
    "servicios/instrumentos": {
        name: "Instrumentos",
        template: "/features/servicios/instrumentos.html",
        component: "servicios"
    },
    "contacto": {
        name: "Contacto",
        template: "/features/contacto/contacto.html",
        component: "contacto"
    },
    "404": {
        name: "Error",
        template: "/features/404/404.html",
        component: "error",
        init: "init404"
    }
};