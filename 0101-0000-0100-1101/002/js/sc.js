/* ============================================================
   HUELLITAS ETERNAS
   scroll.js
   Sistema de desplazamiento y comportamiento al hacer scroll
   ============================================================ */

'use strict';


/* ============================================================
   01. CONFIGURACIÓN
   ============================================================ */

const HuellitasScroll = {

    initialized: false,

    isScrolling: false,

    lastScrollPosition: 0,

    ticking: false,

    reducedMotion: false,

    elements: {

        header: null,

        backToTop: null,

        anchorLinks: [],

        sections: []

    },

    config: {

        scrollOffset: 80,

        showBackToTopAt: 500,

        activeSectionOffset: 150

    }

};


/* ============================================================
   02. INICIALIZACIÓN
   ============================================================ */

HuellitasScroll.init = function () {

    if (this.initialized) {

        return;

    }

    this.cacheElements();

    this.detectReducedMotion();

    this.setupAnchorLinks();

    this.setupScrollListener();

    this.setupBackToTop();

    this.setupSectionObserver();

    this.updateScrollState();

    this.initialized = true;

    this.log(
        'scroll.js iniciado correctamente.'
    );

};


/* ============================================================
   03. GUARDAR ELEMENTOS
   ============================================================ */

HuellitasScroll.cacheElements = function () {

    this.elements.header =
        document.querySelector(
            '.site-header'
        );


    this.elements.backToTop =
        document.querySelector(
            '[data-scroll-top]'
        );


    this.elements.anchorLinks =
        [
            ...document.querySelectorAll(
                'a[href^="#"]'
            )
        ];


    this.elements.sections =
        [
            ...document.querySelectorAll(
                'section[id]'
            )
        ];

};


/* ============================================================
   04. DETECTAR REDUCCIÓN DE MOVIMIENTO
   ============================================================ */

HuellitasScroll.detectReducedMotion =
    function () {

        this.reducedMotion =
            window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches;

    };


/* ============================================================
   05. ENLACES INTERNOS
   ============================================================ */

HuellitasScroll.setupAnchorLinks =
    function () {

        this.elements.anchorLinks
            .forEach(
                link => {

                    link.addEventListener(
                        'click',
                        event => {

                            const targetID =
                                link.getAttribute(
                                    'href'
                                );


                            if (
                                !targetID ||
                                targetID === '#'
                            ) {

                                return;

                            }


                            const target =
                                document.querySelector(
                                    targetID
                                );


                            if (
                                !target
                            ) {

                                return;

                            }


                            event.preventDefault();

                            this.scrollToElement(
                                target
                            );

                        }
                    );

                }
            );

    };


/* ============================================================
   06. DESPLAZARSE HASTA ELEMENTO
   ============================================================ */

HuellitasScroll.scrollToElement =
    function (
        element
    ) {

        if (
            !element
        ) {

            return;

        }


        const elementPosition =
            element.getBoundingClientRect()
                .top;


        const currentPosition =
            window.pageYOffset ||
            document.documentElement.scrollTop;


        const targetPosition =
            elementPosition +
            currentPosition -
            this.config.scrollOffset;


        window.scrollTo(
            {
                top: Math.max(
                    0,
                    targetPosition
                ),

                behavior:
                    this.reducedMotion
                        ? 'auto'
                        : 'smooth'
            }
        );


        this.closeMobileNavigation();

    };


/* ============================================================
   07. CERRAR NAVEGACIÓN MÓVIL
   ============================================================ */

HuellitasScroll.closeMobileNavigation =
    function () {

        const navigation =
            document.querySelector(
                '#main-navigation'
            );


        const menuButton =
            document.querySelector(
                '#menu-button'
            );


        if (
            navigation
        ) {

            navigation.classList.remove(
                'active'
            );

        }


        if (
            menuButton
        ) {

            menuButton.classList.remove(
                'active'
            );


            menuButton.setAttribute(
                'aria-expanded',
                'false'
            );

        }


        document.body.classList.remove(
            'menu-open'
        );

    };


/* ============================================================
   08. LISTENER DEL SCROLL
   ============================================================ */

HuellitasScroll.setupScrollListener =
    function () {

        window.addEventListener(
            'scroll',
            () => {

                this.requestScrollUpdate();

            },
            {
                passive: true
            }
        );

    };


/* ============================================================
   09. OPTIMIZAR SCROLL
   ============================================================ */

HuellitasScroll.requestScrollUpdate =
    function () {

        if (
            this.ticking
        ) {

            return;

        }


        this.ticking =
            true;


        window.requestAnimationFrame(
            () => {

                this.updateScrollState();

                this.ticking =
                    false;

            }
        );

    };


/* ============================================================
   10. ACTUALIZAR ESTADO DEL SCROLL
   ============================================================ */

HuellitasScroll.updateScrollState =
    function () {

        const currentPosition =
            window.pageYOffset ||
            document.documentElement.scrollTop;


        this.updateHeader(
            currentPosition
        );


        this.updateBackToTop(
            currentPosition
        );


        this.updateScrollDirection(
            currentPosition
        );


        this.updateActiveSection(
            currentPosition
        );


        this.lastScrollPosition =
            Math.max(
                0,
                currentPosition
            );

    };


/* ============================================================
   11. ESTADO DEL HEADER
   ============================================================ */

HuellitasScroll.updateHeader =
    function (
        scrollPosition
    ) {

        const header =
            this.elements.header;


        if (
            !header
        ) {

            return;

        }


        header.classList.toggle(
            'is-scrolled',
            scrollPosition > 30
        );

    };


/* ============================================================
   12. BOTÓN VOLVER ARRIBA
   ============================================================ */

HuellitasScroll.setupBackToTop =
    function () {

        const button =
            this.elements.backToTop;


        if (
            !button
        ) {

            return;

        }


        button.addEventListener(
            'click',
            event => {

                event.preventDefault();

                this.scrollToTop();

            }
        );


        this.updateBackToTop(
            window.pageYOffset
        );

    };


/* ============================================================
   13. MOSTRAR / OCULTAR VOLVER ARRIBA
   ============================================================ */

HuellitasScroll.updateBackToTop =
    function (
        scrollPosition
    ) {

        const button =
            this.elements.backToTop;


        if (
            !button
        ) {

            return;

        }


        const visible =
            scrollPosition >
            this.config.showBackToTopAt;


        button.classList.toggle(
            'is-visible',
            visible
        );


        button.setAttribute(
            'aria-hidden',
            String(!visible)
        );

    };


/* ============================================================
   14. VOLVER ARRIBA
   ============================================================ */

HuellitasScroll.scrollToTop =
    function () {

        window.scrollTo(
            {
                top: 0,

                behavior:
                    this.reducedMotion
                        ? 'auto'
                        : 'smooth'
            }
        );

    };


/* ============================================================
   15. DIRECCIÓN DEL SCROLL
   ============================================================ */

HuellitasScroll.updateScrollDirection =
    function (
        currentPosition
    ) {

        const difference =
            currentPosition -
            this.lastScrollPosition;


        if (
            Math.abs(difference) < 5
        ) {

            return;

        }


        document.body.classList.toggle(
            'scrolling-down',
            difference > 0
        );


        document.body.classList.toggle(
            'scrolling-up',
            difference < 0
        );

    };


/* ============================================================
   16. OBSERVAR SECCIONES
   ============================================================ */

HuellitasScroll.setupSectionObserver =
    function () {

        if (
            !('IntersectionObserver' in window)
        ) {

            return;

        }


        if (
            this.elements.sections.length === 0
        ) {

            return;

        }


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                this.setActiveSection(
                                    entry.target.id
                                );

                            }

                        }
                    );

                },
                {
                    rootMargin:
                        `-${this.config.activeSectionOffset}px 0px -55% 0px`,

                    threshold: 0
                }
            );


        this.elements.sections
            .forEach(
                section => {

                    observer.observe(
                        section
                    );

                }
            );


        this.sectionObserver =
            observer;

    };


/* ============================================================
   17. SECCIÓN ACTIVA
   ============================================================ */

HuellitasScroll.setActiveSection =
    function (
        sectionID
    ) {

        if (
            !sectionID
        ) {

            return;

        }


        const navigationLinks =
            document.querySelectorAll(
                `.navigation-link[href="#${sectionID}"]`
            );


        document
            .querySelectorAll(
                '.navigation-link.active'
            )
            .forEach(
                link => {

                    link.classList.remove(
                        'active'
                    );

                }
            );


        navigationLinks
            .forEach(
                link => {

                    link.classList.add(
                        'active'
                    );

                }
            );

    };


/* ============================================================
   18. DETECTAR CAMBIO DE TAMAÑO
   ============================================================ */

HuellitasScroll.setupResize =
    function () {

        window.addEventListener(
            'resize',
            () => {

                this.requestScrollUpdate();

            },
            {
                passive: true
            }
        );

    };


/* ============================================================
   19. DETECTAR CAMBIO DE PREFERENCIA
   ============================================================ */

HuellitasScroll.setupMotionPreference =
    function () {

        const mediaQuery =
            window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            );


        const update =
            event => {

                this.reducedMotion =
                    event.matches;

            };


        if (
            mediaQuery.addEventListener
        ) {

            mediaQuery.addEventListener(
                'change',
                update
            );

        } else {

            mediaQuery.addListener(
                update
            );

        }

    };


/* ============================================================
   20. REINICIAR POSICIÓN
   ============================================================ */

HuellitasScroll.refresh =
    function () {

        this.cacheElements();

        this.updateScrollState();

    };


/* ============================================================
   21. DESTRUIR
   ============================================================ */

HuellitasScroll.destroy =
    function () {

        if (
            this.sectionObserver
        ) {

            this.sectionObserver.disconnect();

            this.sectionObserver =
                null;

        }


        this.initialized =
            false;

    };


/* ============================================================
   22. MENSAJES DE DEPURACIÓN
   ============================================================ */

HuellitasScroll.log =
    function (...messages) {

        if (
            window.HuellitasEternas &&
            window.HuellitasEternas.config &&
            window.HuellitasEternas.config.debug
        ) {

            console.log(
                '[Huellitas Scroll]',
                ...messages
            );

        }

    };


/* ============================================================
   23. INICIALIZACIÓN GLOBAL
   ============================================================ */

function inicializarScrollHuellitas() {

    HuellitasScroll.init();

    HuellitasScroll.setupResize();

    HuellitasScroll.setupMotionPreference();

}


/* ============================================================
   24. ESPERAR AL DOM
   ============================================================ */

if (
    document.readyState === 'loading'
) {

    document.addEventListener(
        'DOMContentLoaded',
        inicializarScrollHuellitas,
        {
            once: true
        }
    );

} else {

    inicializarScrollHuellitas();

}


/* ============================================================
   25. DISPONIBILIDAD GLOBAL
   ============================================================ */

window.HuellitasScroll =
    HuellitasScroll;


/* ============================================================
   FIN DE scroll.js
   ============================================================ */