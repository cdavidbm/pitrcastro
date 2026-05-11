# Portal ITRC

Sitio institucional de la Agencia del Inspector General de Tributos, Rentas y Contribuciones Parafiscales (UAE ITRC).

Front estático en **Astro 4** consumiendo un CMS headless **Strapi v5** + **Postgres**. El contenido se renderiza en build-time; el sitio servido por nginx es HTML estático.

## Documentación

- **[Instalación](docs/instalacion.md)** — levantar el repo en una máquina nueva.
- **[Despliegue](docs/despliegue.md)** — flujo de build + push al servidor.
- **[Backup](docs/backup.md)** — snapshots y restauración del servidor.
- **[Manual del operador](docs/manual-operador/)** — publicar noticias, gestionar documentos, banners, etc.
- **[CMS](cms-strapi/README.md)** — content types, scripts, convenciones del Strapi.
- **[`CLAUDE.md`](CLAUDE.md)** — convenciones del repo (también consumidas por asistentes de código).

## Comandos rápidos

```bash
# Frontend
npm install
npm run dev       # http://localhost:4321
npm run build     # dist/

# CMS
cd cms-strapi
docker compose up -d
npm install
npm run develop   # http://localhost:1337/admin

# Deploy
git push origin main          # auto-deploy via runner self-hosted
npm run deploy                # fallback manual
npm run deploy:binarios       # subir documentos al servidor
```

## Estructura

```
.
├── src/                    # Frontend Astro
│   ├── pages/              # Routing file-based
│   ├── components/         # Componentes .astro reusables
│   ├── content/            # JSON fuente (también respaldo)
│   ├── styles/             # CSS con tema multi-paleta
│   └── utils/              # strapi-fetchers, url, files
├── cms-strapi/             # CMS Strapi v5
├── public/                 # Assets estáticos (gitignored: documentos/)
├── docs/                   # Documentación pública
├── ops/                    # Scripts de servidor (backup, etc.)
└── .github/workflows/      # CI/CD (deploy.yml)
```

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | Astro 4, TypeScript, CSS variables (sin framework CSS) |
| CMS | Strapi v5 CE |
| Base de datos | Postgres en Docker |
| Servidor | nginx en Ubuntu, VPN FortiClient |
| CI/CD | GitHub Actions con runner self-hosted |
| Iconos | Font Awesome 6 |
| Tipografía | Nunito Sans |
