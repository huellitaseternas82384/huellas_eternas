/* ============================================================
   HUELLITAS ETERNAS
   script.js
   Script principal del sitio web
   ============================================================ */

'use strict';


/* ============================================================
   01. CONFIGURACIÓN GENERAL
   ============================================================ */

const HuellitasEternas = {

    name: 'Huellitas Eternas',

    version: '1.0.0',

    initialized: false,

    config: {

        debug: false,

        language: 'es',

        scrollOffset: 80,

        transitionDuration: 300

    }

};


/* ============================================================
   02. ELEMENTOS PRINCIPALES
   ============================================================ */

HuellitasEternas.elements = {

    body: null,

    header: null,

    main: null,

    footer: null,

    menuButton: null,

    navigation: null,

    navigationLinks: [],

    buttons: [],

    sections: [],

    images: []

};


/* ============================================================
   03. INICIALIZACIÓN
   ============================================================ */

HuellitasEternas.init = function () {

    if (this.initialized) {

        return;

    }


    this.cacheElements();

    this.setupGeneralEvents();

    this.setupExternalLinks();

    this.setupImageHandling();

    this.setupKeyboardNavigation();

    this.setupPageVisibility();

    this.initialized = true;


    this.dispatchEvent(
        'huellitas:ready',
        {
            version: this.version
        }
    );


    this.log(
        'Huellitas Eternas iniciado correctamente.'
    );

};


/* ============================================================
   04. GUARDAR ELEMENTOS DEL DOM
   ============================================================ */

HuellitasEternas.cacheElements = function () {

    this.elements.body =
        document.body;


    this.elements.header =
        document.querySelector(
            '.site-header'
        );


    this.elements.main =
        document.querySelector(
            '#contenido-principal'
        );


    this.elements.footer =
        document.querySelector(
            '.site-footer'
        );


    this.elements.menuButton =
        document.querySelector(
            '#menu-button'
        );


    this.elements.navigation =
        document.querySelector(
            '#main-navigation'
        );


    this.elements.navigationLinks =
        [
            ...document.querySelectorAll(
                '.navigation-link'
            )
        ];


    this.elements.buttons =
        [
            ...document.querySelectorAll(
                '.button'
            )
        ];


    this.elements.sections =
        [
            ...document.querySelectorAll(
                'main section'
            )
        ];


    this.elements.images =
        [
            ...document.querySelectorAll(
                'img'
            )
        ];

};


/* ============================================================
   05. EVENTOS GENERALES
   ============================================================ */

HuellitasEternas.setupGeneralEvents =
    function () {

        window.addEventListener(
            'load',
            () => {

                this.handlePageLoad();

            }
        );


        window.addEventListener(
            'resize',
            () => {

                this.handleResize();

            }
        );


        document.addEventListener(
            'visibilitychange',
            () => {

                this.handleVisibilityChange();

            }
        );

    };


/* ============================================================
   06. CARGA DE LA PÁGINA
   ============================================================ */

HuellitasEternas.handlePageLoad =
    function () {

        this.elements.body.classList.add(
            'page-loaded'
        );


        this.dispatchEvent(
            'huellitas:loaded'
        );


        this.log(
            'Página cargada correctamente.'
        );

    };


/* ============================================================
   07. CAMBIO DE TAMAÑO
   ============================================================ */

HuellitasEternas.handleResize =
    function () {

        this.dispatchEvent(
            'huellitas:resize',
            {
                width:
                    window.innerWidth,

                height:
                    window.innerHeight
            }
        );

    };


/* ============================================================
   08. ENLACES EXTERNOS
   ============================================================ */

HuellitasEternas.setupExternalLinks =
    function () {

        const links =
            document.querySelectorAll(
                'a[href^="http://"], a[href^="https://"]'
            );


        links.forEach(
            link => {

                const url =
                    link.href;


                if (
                    !url.includes(
                        window.location.hostname
                    )
                ) {

                    link.setAttribute(
                        'target',
                        '_blank'
                    );


                    link.setAttribute(
                        'rel',
                        'noopener noreferrer'
                    );

                }

            }
        );

    };


/* ============================================================
   09. CONTROL DE IMÁGENES
   ============================================================ */

HuellitasEternas.setupImageHandling =
    function () {

        this.elements.images.forEach(
            image => {

                image.addEventListener(
                    'error',
                    () => {

                        this.handleImageError(
                            image
                        );

                    }
                );


                image.addEventListener(
                    'load',
                    () => {

                        image.classList.add(
                            'image-loaded'
                        );

                    }
                );

            }
        );

    };


/* ============================================================
   10. ERROR DE IMAGEN
   ============================================================ */

HuellitasEternas.handleImageError =
    function (image) {

        image.classList.add(
            'image-error'
        );


        this.log(
            'No se pudo cargar una imagen:',
            image.src
        );

    };


/* ============================================================
   11. NAVEGACIÓN MEDIANTE TECLADO
   ============================================================ */

HuellitasEternas.setupKeyboardNavigation =
    function () {

        document.addEventListener(
            'keydown',
            event => {

                if (
                    event.key ===
                    'Escape'
                ) {

                    this.dispatchEvent(
                        'huellitas:escape'
                    );

                }

            }
        );

    };


/* ============================================================
   12. VISIBILIDAD DE LA PÁGINA
   ============================================================ */

HuellitasEternas.setupPageVisibility =
    function () {

        document.addEventListener(
            'visibilitychange',
            () => {

                if (
                    document.hidden
                ) {

                    this.log(
                        'La página está en segundo plano.'
                    );

                } else {

                    this.log(
                        'La página volvió a estar activa.'
                    );

                }

            }
        );

    };


/* ============================================================
   13. MANEJO DE VISIBILIDAD
   ============================================================ */

HuellitasEternas.handleVisibilityChange =
    function () {

        this.dispatchEvent(
            'huellitas:visibility',
            {
                hidden:
                    document.hidden
            }
        );

    };


/* ============================================================
   14. OBTENER SECCIÓN
   ============================================================ */

HuellitasEternas.getSection =
    function (id) {

        if (
            !id
        ) {

            return null;

        }


        return document.getElementById(
            id
        );

    };


/* ============================================================
   15. IR A UNA SECCIÓN
   ============================================================ */

HuellitasEternas.goToSection =
    function (id) {

        const section =
            this.getSection(
                id
            );


        if (
            !section
        ) {

            this.log(
                'Sección no encontrada:',
                id
            );


            return;

        }


        const headerHeight =
            this.elements.header
                ? this.elements.header
                    .offsetHeight
                : 0;


        const position =
            section.getBoundingClientRect()
                .top +
            window.scrollY -
            headerHeight;


        window.scrollTo(
            {
                top:
                    Math.max(
                        position,
                        0
                    ),

                behavior:
                    'smooth'
            }
        );


        this.dispatchEvent(
            'huellitas:navigate',
            {
                section:
                    id
            }
        );

    };


/* ============================================================
   16. OBTENER INFORMACIÓN DE LA PÁGINA
   ============================================================ */

HuellitasEternas.getPageInfo =
    function () {

        return {

            title:
                document.title,

            url:
                window.location.href,

            path:
                window.location.pathname,

            width:
                window.innerWidth,

            height:
                window.innerHeight,

            language:
                document.documentElement
                    .lang

        };

    };


/* ============================================================
   17. DETECTAR DISPOSITIVO MÓVIL
   ============================================================ */

HuellitasEternas.isMobile =
    function () {

        return window.innerWidth <= 768;

    };


/* ============================================================
   18. DETECTAR TABLET
   ============================================================ */

HuellitasEternas.isTablet =
    function () {

        return (
            window.innerWidth > 768 &&
            window.innerWidth <= 1024
        );

    };


/* ============================================================
   19. DETECTAR ESCRITORIO
   ============================================================ */

HuellitasEternas.isDesktop =
    function () {

        return window.innerWidth > 1024;

    };


/* ============================================================
   20. OBTENER TEMA DEL SISTEMA
   ============================================================ */

HuellitasEternas.getSystemTheme =
    function () {

        if (
            !window.matchMedia
        ) {

            return 'light';

        }


        return window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches
            ? 'dark'
            : 'light';

    };


/* ============================================================
   21. DETECTAR REDUCCIÓN DE MOVIMIENTO
   ============================================================ */

HuellitasEternas.prefersReducedMotion =
    function () {

        if (
            !window.matchMedia
        ) {

            return false;

        }


        return window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

    };


/* ============================================================
   22. AGREGAR CLASE
   ============================================================ */

HuellitasEternas.addClass =
    function (
        element,
        className
    ) {

        if (
            !element ||
            !className
        ) {

            return;

        }


        element.classList.add(
            className
        );

    };


/* ============================================================
   23. ELIMINAR CLASE
   ============================================================ */

HuellitasEternas.removeClass =
    function (
        element,
        className
    ) {

        if (
            !element ||
            !className
        ) {

            return;

        }


        element.classList.remove(
            className
        );

    };


/* ============================================================
   24. ALTERNAR CLASE
   ============================================================ */

HuellitasEternas.toggleClass =
    function (
        element,
        className
    ) {

        if (
            !element ||
            !className
        ) {

            return false;

        }


        return element.classList.toggle(
            className
        );

    };


/* ============================================================
   25. COMPROBAR CLASE
   ============================================================ */

HuellitasEternas.hasClass =
    function (
        element,
        className
    ) {

        if (
            !element ||
            !className
        ) {

            return false;

        }


        return element.classList.contains(
            className
        );

    };


/* ============================================================
   26. SELECCIONAR ELEMENTO
   ============================================================ */

HuellitasEternas.select =
    function (selector) {

        return document.querySelector(
            selector
        );

    };


/* ============================================================
   27. SELECCIONAR ELEMENTOS
   ============================================================ */

HuellitasEternas.selectAll =
    function (selector) {

        return [
            ...document.querySelectorAll(
                selector
            )
        ];

    };


/* ============================================================
   28. CREAR EVENTO PERSONALIZADO
   ============================================================ */

HuellitasEternas.dispatchEvent =
    function (
        eventName,
        detail = {}
    ) {

        document.dispatchEvent(
            new CustomEvent(
                eventName,
                {
                    detail
                }
            )
        );

    };


/* ============================================================
   29. REGISTRO DE MENSAJES
   ============================================================ */

HuellitasEternas.log =
    function (...messages) {

        if (
            !this.config.debug
        ) {

            return;

        }


        console.log(
            '[Huellitas Eternas]',
            ...messages
        );

    };


/* ============================================================
   30. ADVERTENCIA
   ============================================================ */

HuellitasEternas.warn =
    function (...messages) {

        if (
            !this.config.debug
        ) {

            return;

        }


        console.warn(
            '[Huellitas Eternas]',
            ...messages
        );

    };


/* ============================================================
   31. ERROR
   ============================================================ */

HuellitasEternas.error =
    function (...messages) {

        console.error(
            '[Huellitas Eternas]',
            ...messages
        );

    };


/* ============================================================
   32. INICIALIZACIÓN DEL DOCUMENTO
   ============================================================ */

if (
    document.readyState ===
    'loading'
) {

    document.addEventListener(
        'DOMContentLoaded',
        () => {

            HuellitasEternas.init();

        },
        {
            once: true
        }
    );

} else {

    HuellitasEternas.init();

}


/* ============================================================
   33. DISPONIBILIDAD GLOBAL
   ============================================================ */

window.HuellitasEternas =
    HuellitasEternas;


/* ============================================================
   FIN DE script.js
   ============================================================ */