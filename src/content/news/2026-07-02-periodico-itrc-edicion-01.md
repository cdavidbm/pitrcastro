---
title: "Periódico ITRC — Edición No. 01 de 2026"
date: 2026-07-02T12:00:00-05:00
image: "/images/slider-periodico-01-2026.webp"
excerpt: "Primera edición del Periódico ITRC. Un nuevo canal de comunicación institucional con reportajes, actualidad y avances de la gestión de la Agencia. Léelo en línea o descárgalo en PDF."
tags: ["noticias", "periodico"]
categoria: periodico
draft: false
---

<div class="periodico-actions">
  <a href="/documentos/media/prensa/Periodico-ITRC-01-2026.pdf" download class="periodico-btn periodico-btn--primary">
    <i class="fa-solid fa-download" aria-hidden="true"></i>
    <span>Descargar PDF</span>
  </a>
  <a href="/documentos/media/prensa/Periodico-ITRC-01-2026.pdf" target="_blank" rel="noopener" class="periodico-btn periodico-btn--secondary">
    <i class="fa-solid fa-up-right-from-square" aria-hidden="true"></i>
    <span>Abrir PDF en pestaña nueva</span>
  </a>
</div>

<div class="periodico-embed">
  <iframe
    src="https://heyzine.com/flip-book/4bf79c2aec.html"
    title="Periódico ITRC — Edición No. 01 de 2026"
    allowfullscreen
    allow="clipboard-write"
    loading="lazy"
  ></iframe>
</div>

<p class="periodico-help">
  <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
  Pasa las páginas tocando o arrastrando en el visor. Si prefieres verlo sin conexión, usa el botón <strong>Descargar PDF</strong>.
</p>

<style>
  .periodico-actions {
    display: flex; flex-wrap: wrap; gap: var(--space-3, 1rem);
    justify-content: center; margin: var(--space-6, 2rem) 0;
  }
  .periodico-btn {
    display: inline-flex; align-items: center; gap: var(--space-2, 0.5rem);
    padding: var(--space-3, 0.75rem) var(--space-5, 1.5rem);
    border-radius: var(--radius-full, 999px);
    text-decoration: none; font-weight: 700; font-size: var(--font-size-sm, 0.875rem);
    transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
  }
  .periodico-btn--primary {
    background: var(--itrc-gold, #b38b40); color: var(--itrc-navy, #002147);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
  .periodico-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
  .periodico-btn--secondary {
    background: transparent; color: var(--theme-heading);
    border: 2px solid var(--theme-border, #ccc);
  }
  .periodico-btn--secondary:hover {
    background: var(--theme-surface-alt); color: var(--itrc-navy, #002147);
  }
  .periodico-embed {
    position: relative; width: 100%; padding-bottom: 66%;
    height: 0; overflow: hidden; border-radius: var(--radius-lg, 12px);
    box-shadow: 0 12px 32px rgba(0, 33, 71, 0.15);
    margin: var(--space-6, 2rem) 0;
    background: var(--theme-surface-alt);
  }
  .periodico-embed iframe {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;
  }
  .periodico-help {
    text-align: center; color: var(--theme-text-secondary, #555);
    font-size: var(--font-size-sm, 0.875rem);
    margin-top: var(--space-4, 1rem);
  }
  .periodico-help i { color: var(--itrc-gold, #b38b40); margin-right: 0.25rem; }
  @media (max-width: 640px) {
    .periodico-embed { padding-bottom: 130%; }
  }
</style>
