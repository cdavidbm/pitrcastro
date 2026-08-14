import * as React from 'react';
import type { StrapiApp } from '@strapi/strapi/admin';

import PreviewButton from './PreviewButton';

/**
 * Icono del enlace "Contenido del sitio" en el menú lateral: una lista con
 * viñetas. Va dibujado aquí y no importado de @strapi/icons porque ese paquete
 * no es una dependencia declarada del CMS y el empaquetador no lo resuelve.
 */
const SiteContentIcon = () =>
  React.createElement(
    'svg',
    { width: '1.6rem', height: '1.6rem', viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true },
    React.createElement('circle', { cx: 4, cy: 6, r: 2 }),
    React.createElement('circle', { cx: 4, cy: 12, r: 2 }),
    React.createElement('circle', { cx: 4, cy: 18, r: 2 }),
    React.createElement('rect', { x: 9, y: 5, width: 12, height: 2, rx: 1 }),
    React.createElement('rect', { x: 9, y: 11, width: 12, height: 2, rx: 1 }),
    React.createElement('rect', { x: 9, y: 17, width: 12, height: 2, rx: 1 })
  );

/**
 * Personalización del panel de administración de Strapi. Añade dos cosas:
 *
 *   1. "Contenido del sitio" — una entrada propia en el menú lateral que
 *      organiza los tipos de contenido como el menú del portal.
 *   2. "Ver en el sitio" — un enlace a la página pública desde el editor.
 */
export default {
  config: {
    locales: [],
  },
  register(app: StrapiApp) {
    // Entrada propia en el menú lateral que organiza los 150+ tipos de
    // contenido como el menú del portal, con dos selectores en cascada. El
    // Content Manager nativo los lista en plano y es impracticable a esta
    // escala.
    //
    // Se resuelve con una página propia, que es la vía oficial. El panel del
    // Content Manager es interfaz interna de Strapi y alterarlo exigiría
    // manipular el DOM por fuera de React.
    app.addMenuLink({
      to: '/contenido-del-sitio',
      icon: SiteContentIcon,
      intlLabel: {
        id: 'itrc.contenido-del-sitio.menu',
        defaultMessage: 'Contenido del sitio',
      },
      position: 1,
      permissions: [],
      Component: () => import('./pages/ContenidoDelSitio'),
    });
  },
  bootstrap(app: StrapiApp) {
    // Botón "Ver en el sitio" en la barra derecha del editor. Lee el tipo de
    // contenido desde la dirección del navegador y arma el enlace a la página
    // pública correspondiente.
    app.getPlugin('content-manager').injectComponent('editView', 'right-links', {
      name: 'itrc-preview-button',
      Component: PreviewButton,
    });
  },
};
