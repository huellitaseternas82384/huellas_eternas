/* ============================================================
   HUELLITAS ETERNAS
   animaciones.js
   Sistema de animaciones e interacción visual
   ============================================================ */

'use strict';


/* ============================================================
   01. CONFIGURACIÓN
   ============================================================ */

const HuellitasAnimaciones = {

    initialized: false,

    observer: null,

    elements: [],

    config: {

        threshold: 0.15,

        rootMargin: '0px 0px -60px 0px',

        once: true,

        duration: 700

    }

};


/* ============================================================
   02. INICIALIZACIÓN
   ============================================================ */

HuellitasAnimaciones.init = function () {

    if (this.initialized) {

        return;

    }


    this.detectReducedMotion();

    this.prepareElements();

    this.createObserver();

    this.setupHoverAnimations();

    this.setupPageAnimation();

    this.initialized = true;


    this.log(
        'animaciones.js iniciado correctamente.'
    );

};


/* ============================================================
   03. DETECTAR REDUCCIÓN DE MOVIMIENTO
   ============================================================ */

HuellitasAnimaciones.detectReducedMotion =
    function () {

        this.reducedMotion =
            window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches;


        if (
            this.reducedMotion
        ) {

            document.documentElement.classList.add(
                'reduce-motion'
            );

        }

    };


/* ============================================================
   04. PREPARAR ELEMENTOS
   ============================================================ */

HuellitasAnimaciones.prepareElements =
    function () {

        this.elements =
            [
                ...document.querySelectorAll(
                    '[data-animation]'
                )
            ];


        this.elements.forEach(
            element => {

                const animation =
                    element.dataset.animation;


                if (
                    animation
                ) {

                    element.classList.add(
                        'animation-ready'
                    );

                }

            }
        );

    };


/* ============================================================
   05. CREAR OBSERVER
   ============================================================ */

HuellitasAnimaciones.createObserver =
    function () {

        if (
            this.reducedMotion
        ) {

            this.showAllElements();

            return;

        }


        if (
            !('IntersectionObserver' in window)
        ) {

            this.showAllElements();

            return;

        }


        this.observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                this.animateElement(
                                    entry.target
                                );


                                if (
                                    this.config.once
                                ) {

                                    this.observer.unobserve(
                                        entry.target
                                    );

                                }

                            }

                        }
                    );

                },
                {
                    threshold:
                        this.config.threshold,

                    rootMargin:
                        this.config.rootMargin
                }
            );


        this.elements.forEach(
            element => {

                this.observer.observe(
                    element
                );

            }
        );

    };


/* ============================================================
   06. ANIMAR ELEMENTO
   ============================================================ */

HuellitasAnimaciones.animateElement =
    function (element) {

        if (
            !element
        ) {

            return;

        }


        const animation =
            element.dataset.animation ||
            'fade-up';


        element.classList.add(
            'is-visible'
        );


        element.classList.add(
            `animation-${animation}`
        );


        element.dispatchEvent(
            new CustomEvent(
                'huellitas:animation-start',
                {
                    detail: {
                        animation,
                        element
                    }
                }
            )
        );


        window.setTimeout(
            () => {

                element.classList.add(
                    'animation-complete'
                );


                element.dispatchEvent(
                    new CustomEvent(
                        'huellitas:animation-complete',
                        {
                            detail: {
                                animation,
                                element
                            }
                        }
                    )
                );

            },
            this.config.duration
        );

    };


/* ============================================================
   07. MOSTRAR TODOS LOS ELEMENTOS
   ============================================================ */

HuellitasAnimaciones.showAllElements =
    function () {

        this.elements.forEach(
            element => {

                element.classList.add(
                    'is-visible'
                );

                element.classList.add(
                    'animation-complete'
                );

            }
        );

    };


/* ============================================================
   08. ANIMACIONES AL PASAR EL RATÓN
   ============================================================ */

HuellitasAnimaciones.setupHoverAnimations =
    function () {

        if (
            this.reducedMotion
        ) {

            return;

        }


        const hoverElements =
            document.querySelectorAll(
                '[data-hover-animation]'
            );


        hoverElements.forEach(
            element => {

                const animation =
                    element.dataset.hoverAnimation;


                element.addEventListener(
                    'mouseenter',
                    () => {

                        element.classList.add(
                            `hover-${animation}`
                        );

                    }
                );


                element.addEventListener(
                    'mouseleave',
                    () => {

                        element.classList.remove(
                            `hover-${animation}`
                        );

                    }
                );

            }
        );

    };


/* ============================================================
   09. ANIMACIÓN INICIAL DE LA PÁGINA
   ============================================================ */

HuellitasAnimaciones.setupPageAnimation =
    function () {

        if (
            this.reducedMotion
        ) {

            document.body.classList.add(
                'page-animation-complete'
            );

            return;

        }


        window.requestAnimationFrame(
            () => {

                document.body.classList.add(
                    'page-animation-start'
                );


                window.setTimeout(
                    () => {

                        document.body.classList.add(
                            'page-animation-complete'
                        );

                    },
                    500
                );

            }
        );

    };


/* ============================================================
   10. ANIMAR ELEMENTO MANUALMENTE
   ============================================================ */

HuellitasAnimaciones.animate =
    function (
        selector,
        animation = 'fade-up'
    ) {

        const elements =
            typeof selector === 'string'
                ? document.querySelectorAll(
                    selector
                )
                : [selector];


        elements.forEach(
            element => {

                if (
                    !element
                ) {

                    return;

                }


                element.dataset.animation =
                    animation;


                this.animateElement(
                    element
                );

            }
        );

    };


/* ============================================================
   11. REINICIAR ANIMACIÓN
   ============================================================ */

HuellitasAnimaciones.reset =
    function (
        selector
    ) {

        const elements =
            typeof selector === 'string'
                ? document.querySelectorAll(
                    selector
                )
                : [selector];


        elements.forEach(
            element => {

                if (
                    !element
                ) {

                    return;

                }


                element.classList.remove(
                    'is-visible'
                );


                element.classList.remove(
                    'animation-complete'
                );


                const animation =
                    element.dataset.animation;


                if (
                    animation
                ) {

                    element.classList.remove(
                        `animation-${animation}`
                    );

                }

            }
        );

    };


/* ============================================================
   12. ANIMAR POR GRUPOS
   ============================================================ */

HuellitasAnimaciones.animateGroup =
    function (
        selector,
        delay = 100
    ) {

        const elements =
            document.querySelectorAll(
                selector
            );


        elements.forEach(
            (
                element,
                index
            ) => {

                window.setTimeout(
                    () => {

                        this.animateElement(
                            element
                        );

                    },
                    index * delay
                );

            }
        );

    };


/* ============================================================
   13. ANIMACIÓN ESCALONADA
   ============================================================ */

HuellitasAnimaciones.stagger =
    function (
        selector,
        delay = 100
    ) {

        const elements =
            document.querySelectorAll(
                selector
            );


        elements.forEach(
            (
                element,
                index
            ) => {

                element.style.setProperty(
                    '--animation-delay',
                    `${index * delay}ms`
                );

            }
        );

    };


/* ============================================================
   14. PAUSAR TODAS LAS ANIMACIONES
   ============================================================ */

HuellitasAnimaciones.pauseAll =
    function () {

        document.documentElement.classList.add(
            'animations-paused'
        );

    };


/* ============================================================
   15. REANUDAR TODAS LAS ANIMACIONES
   ============================================================ */

HuellitasAnimaciones.resumeAll =
    function () {

        document.documentElement.classList.remove(
            'animations-paused'
        );

    };


/* ============================================================
   16. COMPROBAR SOPORTE
   ============================================================ */

HuellitasAnimaciones.supportsAnimations =
    function () {

        return (
            'IntersectionObserver' in window &&
            !this.reducedMotion
        );

    };


/* ============================================================
   17. CAMBIO DE PREFERENCIAS DEL USUARIO
   ============================================================ */

HuellitasAnimaciones.watchMotionPreference =
    function () {

        const mediaQuery =
            window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            );


        const updatePreference =
            event => {

                this.reducedMotion =
                    event.matches;


                document.documentElement.classList.toggle(
                    'reduce-motion',
                    this.reducedMotion
                );


                if (
                    this.reducedMotion
                ) {

                    this.showAllElements();

                }

            };


        if (
            mediaQuery.addEventListener
        ) {

            mediaQuery.addEventListener(
                'change',
                updatePreference
            );

        } else {

            mediaQuery.addListener(
                updatePreference
            );

        }

    };


/* ============================================================
   18. LIMPIAR OBSERVER
   ============================================================ */

HuellitasAnimaciones.destroy =
    function () {

        if (
            this.observer
        ) {

            this.observer.disconnect();

            this.observer =
                null;

        }


        this.elements.forEach(
            element => {

                element.classList.remove(
                    'animation-ready'
                );

            }
        );


        this.initialized =
            false;

    };


/* ============================================================
   19. MENSAJES DE DEPURACIÓN
   ============================================================ */

HuellitasAnimaciones.log =
    function (...messages) {

        if (
            window.HuellitasEternas &&
            window.HuellitasEternas.config &&
            window.HuellitasEternas.config.debug
        ) {

            console.log(
                '[Huellitas Animaciones]',
                ...messages
            );

        }

    };


/* ============================================================
   20. INICIALIZACIÓN
   ============================================================ */

function inicializarAnimacionesHuellitas() {

    HuellitasAnimaciones.init();

    HuellitasAnimaciones.watchMotionPreference();

}


/* ============================================================
   21. ESPERAR AL DOM
   ============================================================ */

if (
    document.readyState === 'loading'
) {

    document.addEventListener(
        'DOMContentLoaded',
        inicializarAnimacionesHuellitas,
        {
            once: true
        }
    );

} else {

    inicializarAnimacionesHuellitas();

}


/* ============================================================
   22. DISPONIBILIDAD GLOBAL
   ============================================================ */

window.HuellitasAnimaciones =
    HuellitasAnimaciones;


/* ============================================================
   FIN DE animaciones.js
   ============================================================ */