/* ============================================================
   HUELLITAS ETERNAS
   botones.js
   Control de botones e interacciones
   ============================================================ */

'use strict';


/* ============================================================
   01. CONFIGURACIÓN
   ============================================================ */

const HuellitasBotones = {

    initialized: false,

    elements: {

        menuButton: null,

        navigation: null,

        navigationLinks: [],

        buttons: [],

        backButtons: [],

        actionButtons: []

    }

};


/* ============================================================
   02. INICIALIZACIÓN
   ============================================================ */

HuellitasBotones.init = function () {

    if (this.initialized) {

        return;

    }

    this.cacheElements();

    this.setupMenuButton();

    this.setupNavigationLinks();

    this.setupButtons();

    this.setupBackButtons();

    this.initialized = true;

    this.log(
        'botones.js iniciado correctamente.'
    );

};


/* ============================================================
   03. GUARDAR ELEMENTOS
   ============================================================ */

HuellitasBotones.cacheElements = function () {

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


    this.elements.backButtons =
        [
            ...document.querySelectorAll(
                '[data-back]'
            )
        ];


    this.elements.actionButtons =
        [
            ...document.querySelectorAll(
                '[data-action]'
            )
        ];

};


/* ============================================================
   04. BOTÓN DEL MENÚ
   ============================================================ */

HuellitasBotones.setupMenuButton =
    function () {

        const button =
            this.elements.menuButton;

        const navigation =
            this.elements.navigation;


        if (
            !button ||
            !navigation
        ) {

            this.log(
                'Botón de menú o navegación no encontrado.'
            );

            return;

        }


        button.addEventListener(
            'click',
            () => {

                this.toggleMenu();

            }
        );

    };


/* ============================================================
   05. ABRIR / CERRAR MENÚ
   ============================================================ */

HuellitasBotones.toggleMenu =
    function () {

        const button =
            this.elements.menuButton;

        const navigation =
            this.elements.navigation;


        if (
            !button ||
            !navigation
        ) {

            return;

        }


        const isOpen =
            button.classList.toggle(
                'active'
            );


        navigation.classList.toggle(
            'active',
            isOpen
        );


        button.setAttribute(
            'aria-expanded',
            String(isOpen)
        );


        navigation.setAttribute(
            'aria-hidden',
            String(!isOpen)
        );


        document.body.classList.toggle(
            'menu-open',
            isOpen
        );


        this.dispatch(
            'huellitas:menu',
            {
                open: isOpen
            }
        );

    };


/* ============================================================
   06. CERRAR MENÚ
   ============================================================ */

HuellitasBotones.closeMenu =
    function () {

        const button =
            this.elements.menuButton;

        const navigation =
            this.elements.navigation;


        if (
            !button ||
            !navigation
        ) {

            return;

        }


        button.classList.remove(
            'active'
        );


        navigation.classList.remove(
            'active'
        );


        button.setAttribute(
            'aria-expanded',
            'false'
        );


        navigation.setAttribute(
            'aria-hidden',
            'true'
        );


        document.body.classList.remove(
            'menu-open'
        );

    };


/* ============================================================
   07. ENLACES DE NAVEGACIÓN
   ============================================================ */

HuellitasBotones.setupNavigationLinks =
    function () {

        this.elements.navigationLinks
            .forEach(
                link => {

                    link.addEventListener(
                        'click',
                        () => {

                            this.closeMenu();

                        }
                    );

                }
            );

    };


/* ============================================================
   08. BOTONES GENERALES
   ============================================================ */

HuellitasBotones.setupButtons =
    function () {

        this.elements.buttons
            .forEach(
                button => {

                    button.addEventListener(
                        'click',
                        event => {

                            this.handleButtonClick(
                                event,
                                button
                            );

                        }
                    );

                }
            );

    };


/* ============================================================
   09. CLIC EN BOTÓN
   ============================================================ */

HuellitasBotones.handleButtonClick =
    function (
        event,
        button
    ) {

        if (
            !button
        ) {

            return;

        }


        button.classList.add(
            'button-clicked'
        );


        window.setTimeout(
            () => {

                button.classList.remove(
                    'button-clicked'
                );

            },
            250
        );


        this.dispatch(
            'huellitas:button-click',
            {
                button,
                text:
                    button.textContent.trim()
            }
        );

    };


/* ============================================================
   10. BOTONES CON DATA-ACTION
   ============================================================ */

HuellitasBotones.setupActionButtons =
    function () {

        this.elements.actionButtons
            .forEach(
                button => {

                    button.addEventListener(
                        'click',
                        () => {

                            const action =
                                button.dataset.action;

                            this.executeAction(
                                action,
                                button
                            );

                        }
                    );

                }
            );

    };


/* ============================================================
   11. EJECUTAR ACCIÓN
   ============================================================ */

HuellitasBotones.executeAction =
    function (
        action,
        button
    ) {

        if (
            !action
        ) {

            return;

        }


        switch (
            action
        ) {

            case 'menu':

                this.toggleMenu();

                break;


            case 'close-menu':

                this.closeMenu();

                break;


            case 'top':

                window.scrollTo(
                    {
                        top: 0,

                        behavior: 'smooth'
                    }
                );

                break;


            default:

                this.log(
                    'Acción no reconocida:',
                    action
                );

                break;

        }


        this.dispatch(
            'huellitas:action',
            {
                action,
                button
            }
        );

    };


/* ============================================================
   12. BOTONES DE VOLVER
   ============================================================ */

HuellitasBotones.setupBackButtons =
    function () {

        this.elements.backButtons
            .forEach(
                button => {

                    button.addEventListener(
                        'click',
                        () => {

                            this.goBack();

                        }
                    );

                }
            );

    };


/* ============================================================
   13. VOLVER A LA PÁGINA ANTERIOR
   ============================================================ */

HuellitasBotones.goBack =
    function () {

        if (
            window.history.length > 1
        ) {

            window.history.back();

        } else {

            window.location.href =
                '../index.html';

        }

    };


/* ============================================================
   14. BOTONES QUE ABREN PÁGINAS
   ============================================================ */

HuellitasBotones.setupPageButtons =
    function () {

        const pageButtons =
            document.querySelectorAll(
                '[data-page]'
            );


        pageButtons.forEach(
            button => {

                button.addEventListener(
                    'click',
                    () => {

                        const page =
                            button.dataset.page;


                        if (
                            page
                        ) {

                            window.location.href =
                                page;

                        }

                    }
                );

            }
        );

    };


/* ============================================================
   15. BOTÓN PARA VOLVER ARRIBA
   ============================================================ */

HuellitasBotones.setupTopButton =
    function () {

        const topButton =
            document.querySelector(
                '[data-scroll-top]'
            );


        if (
            !topButton
        ) {

            return;

        }


        topButton.addEventListener(
            'click',
            () => {

                window.scrollTo(
                    {
                        top: 0,

                        behavior: 'smooth'
                    }
                );

            }
        );

    };


/* ============================================================
   16. ESCAPE PARA CERRAR MENÚ
   ============================================================ */

HuellitasBotones.setupEscape =
    function () {

        document.addEventListener(
            'keydown',
            event => {

                if (
                    event.key === 'Escape'
                ) {

                    this.closeMenu();

                }

            }
        );

    };


/* ============================================================
   17. CLIC FUERA DEL MENÚ
   ============================================================ */

HuellitasBotones.setupOutsideClick =
    function () {

        document.addEventListener(
            'click',
            event => {

                const button =
                    this.elements.menuButton;

                const navigation =
                    this.elements.navigation;


                if (
                    !button ||
                    !navigation
                ) {

                    return;

                }


                const menuIsOpen =
                    navigation.classList.contains(
                        'active'
                    );


                if (
                    !menuIsOpen
                ) {

                    return;

                }


                const clickedInsideButton =
                    button.contains(
                        event.target
                    );


                const clickedInsideNavigation =
                    navigation.contains(
                        event.target
                    );


                if (
                    !clickedInsideButton &&
                    !clickedInsideNavigation
                ) {

                    this.closeMenu();

                }

            }
        );

    };


/* ============================================================
   18. PREVENIR DOBLE CLIC ACCIDENTAL
   ============================================================ */

HuellitasBotones.preventDoubleClick =
    function (
        button,
        delay = 500
    ) {

        if (
            !button
        ) {

            return true;

        }


        if (
            button.dataset.processing ===
            'true'
        ) {

            return false;

        }


        button.dataset.processing =
            'true';


        window.setTimeout(
            () => {

                button.dataset.processing =
                    'false';

            },
            delay
        );


        return true;

    };


/* ============================================================
   19. ESTADO DE BOTÓN
   ============================================================ */

HuellitasBotones.setButtonLoading =
    function (
        button,
        loading = true
    ) {

        if (
            !button
        ) {

            return;

        }


        button.classList.toggle(
            'is-loading',
            loading
        );


        button.disabled =
            loading;


        if (
            loading
        ) {

            button.setAttribute(
                'aria-busy',
                'true'
            );

        } else {

            button.removeAttribute(
                'aria-busy'
            );

        }

    };


/* ============================================================
   20. DESACTIVAR BOTÓN
   ============================================================ */

HuellitasBotones.disable =
    function (
        button
    ) {

        if (
            !button
        ) {

            return;

        }


        button.disabled =
            true;


        button.classList.add(
            'is-disabled'
        );

    };


/* ============================================================
   21. ACTIVAR BOTÓN
   ============================================================ */

HuellitasBotones.enable =
    function (
        button
    ) {

        if (
            !button
        ) {

            return;

        }


        button.disabled =
            false;


        button.classList.remove(
            'is-disabled'
        );

    };


/* ============================================================
   22. EMITIR EVENTOS
   ============================================================ */

HuellitasBotones.dispatch =
    function (
        name,
        detail = {}
    ) {

        document.dispatchEvent(
            new CustomEvent(
                name,
                {
                    detail
                }
            )
        );

    };


/* ============================================================
   23. MENSAJES DE DEPURACIÓN
   ============================================================ */

HuellitasBotones.log =
    function (...messages) {

        if (
            window.HuellitasEternas &&
            window.HuellitasEternas.config &&
            window.HuellitasEternas.config.debug
        ) {

            console.log(
                '[Huellitas Botones]',
                ...messages
            );

        }

    };


/* ============================================================
   24. INICIALIZACIÓN
   ============================================================ */

function inicializarBotonesHuellitas() {

    HuellitasBotones.init();

    HuellitasBotones.setupActionButtons();

    HuellitasBotones.setupPageButtons();

    HuellitasBotones.setupTopButton();

    HuellitasBotones.setupEscape();

    HuellitasBotones.setupOutsideClick();

}


/* ============================================================
   25. ESPERAR AL DOM
   ============================================================ */

if (
    document.readyState === 'loading'
) {

    document.addEventListener(
        'DOMContentLoaded',
        inicializarBotonesHuellitas,
        {
            once: true
        }
    );

} else {

    inicializarBotonesHuellitas();

}


/* ============================================================
   26. DISPONIBILIDAD GLOBAL
   ============================================================ */

window.HuellitasBotones =
    HuellitasBotones;


/* ============================================================
   FIN DE botones.js
   ============================================================ */