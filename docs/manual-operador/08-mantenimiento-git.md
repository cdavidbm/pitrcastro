# Capítulo 8 — Mantenimiento con Git

## Qué es Git y por qué es importante para el portal

Git es el sistema de control de versiones que registra cada cambio realizado en el portal. Funciona como un historial detallado que almacena quién hizo qué cambio, cuándo y con qué propósito. Para el portal ITRC, Git cumple dos roles fundamentales:

1. **Mecanismo de publicación**: cuando se envía un cambio al repositorio GitHub, el sistema de despliegue automático (GitHub Actions) construye y publica el sitio.
2. **Sistema de respaldo**: toda la historia del contenido del portal está almacenada en Git. Si se comete un error, es posible recuperar cualquier versión anterior de cualquier archivo.

> **Nota:** El repositorio Git en GitHub es el respaldo completo del portal. No es necesario hacer copias de seguridad manuales de los archivos mientras el repositorio esté actualizado.

## Conceptos básicos de Git

| Término | Significado práctico |
|---------|----------------------|
| **Repositorio (repo)** | La carpeta del proyecto con todo su historial de cambios |
| **Commit** | Un paquete de cambios guardado con un mensaje descriptivo |
| **Push** | Enviar los commits locales al repositorio en GitHub |
| **Pull** | Descargar los cambios más recientes de GitHub a su copia local |
| **Branch (rama)** | Una línea de trabajo independiente. El portal vive en la rama `main` |
| **Merge** | Unir cambios de dos ramas o dos personas |
| **Conflicto** | Cuando dos personas modificaron el mismo archivo de forma incompatible |
| **Revert** | Deshacer un commit específico sin borrar el historial |

## Flujo de trabajo diario recomendado

Este es el procedimiento que debe seguir cada vez que trabaje con el portal directamente en VS Code (no aplica cuando usa el CMS, que automatiza estos pasos):

### Paso 1 — Actualizar su copia local antes de empezar

```bash
git pull origin main
```

Este comando descarga todos los cambios que otras personas hayan realizado desde la última vez que trabajó. Siempre hágalo antes de comenzar a editar.

### Paso 2 — Realizar los cambios

Edite los archivos necesarios en VS Code. Consulte el [Capítulo 7](07-edicion-directa-vscode.md) para las instrucciones de edición.

### Paso 3 — Verificar el portal localmente

```bash
npm run dev
```

Revise que el portal funciona correctamente en `http://localhost:4321` antes de continuar.

### Paso 4 — Revisar qué archivos cambiaron

```bash
git status
```

Este comando lista todos los archivos modificados. Revise la lista para confirmar que solo están los archivos que usted quería cambiar.

### Paso 5 — Preparar el commit

```bash
git add src/content/pages/agencia/gestion-misional.json
```

Agregue solo los archivos relacionados con el cambio que va a registrar. Evite usar `git add .` (que agrega todo) si realizó varios cambios no relacionados.

### Paso 6 — Crear el commit

```bash
git commit -m "docs: agrega informe de gestión II semestre 2025"
```

El mensaje debe ser descriptivo. Buenas prácticas:
- Comience con un prefijo: `docs:` para contenido, `fix:` para correcciones, `feat:` para funcionalidades nuevas.
- Use el tiempo presente: "agrega", "actualiza", "corrige".
- Sea específico: mencione qué sección o archivo cambió.

### Paso 7 — Publicar los cambios

```bash
git push origin main
```

Una vez ejecutado este comando, GitHub Actions iniciará automáticamente el proceso de construcción y despliegue del sitio. El portal estará actualizado en 2 a 5 minutos.

### Paso 8 — Verificar el despliegue

Abra el repositorio en GitHub en su navegador y haga clic en la pestaña **"Actions"**. Verá una lista de ejecuciones recientes. La más nueva debe mostrar una marca verde de verificación cuando el despliegue termine correctamente. Si aparece una X roja, significa que hubo un error; haga clic sobre la ejecución fallida para ver el detalle del error y consulte al equipo técnico.

## Resolver conflictos básicos

Un conflicto ocurre cuando dos personas editan el mismo archivo al mismo tiempo y Git no puede combinar los cambios automáticamente. Esto es poco frecuente si solo hay una persona editando el portal, pero puede ocurrir si alguien usa el CMS mientras otra persona edita directamente en VS Code.

Cuando hay un conflicto, al ejecutar `git pull` verá un mensaje como:

```
CONFLICT (content): Merge conflict in src/content/settings/contact.json
Automatic merge failed; fix conflicts and then commit the result.
```

El archivo en conflicto tendrá marcadores que indican las dos versiones:

```
<<<<<<< HEAD
"phone": "(601) 381 5000"
=======
"phone": "(601) 381 5001"
>>>>>>> origin/main
```

Para resolver el conflicto:

1. Abra el archivo en VS Code. Los conflictos aparecerán resaltados.
2. Decida cuál versión es la correcta (o combine las dos si corresponde).
3. Elimine los marcadores `<<<<<<<`, `=======` y `>>>>>>>`.
4. Guarde el archivo.
5. Agregue el archivo resuelto al commit:
   ```bash
   git add src/content/settings/contact.json
   ```
6. Complete el commit:
   ```bash
   git commit -m "fix: resuelve conflicto en datos de contacto"
   ```
7. Haga push:
   ```bash
   git push origin main
   ```

> **Tip:** VS Code tiene una interfaz visual para resolver conflictos. Al abrir un archivo en conflicto, verá botones en la parte superior de cada sección en conflicto: "Accept Current Change", "Accept Incoming Change" o "Accept Both Changes". Úselos para no tener que editar los marcadores manualmente.

## Recuperar una versión anterior de un archivo

Si cometió un error y necesita recuperar la versión anterior de un archivo:

**Ver el historial de un archivo:**

```bash
git log --oneline src/content/pages/agencia/gestion-misional.json
```

Verá una lista de commits con sus identificadores (hashes) y mensajes. Identifique el commit al que desea volver.

**Recuperar la versión de un commit específico:**

```bash
git checkout abc1234 -- src/content/pages/agencia/gestion-misional.json
```

Reemplace `abc1234` con el hash del commit deseado.

**Luego, guarde esa versión recuperada:**

```bash
git add src/content/pages/agencia/gestion-misional.json
git commit -m "revert: restaura gestion-misional.json a versión del 10 de abril"
git push origin main
```

> **Nota:** Esta operación no borra el commit del error; simplemente crea un nuevo commit que vuelve al estado anterior. El historial completo siempre se preserva.

## Cuándo pedir ayuda al equipo técnico

Comuníquese con el equipo técnico en los siguientes casos:

- El despliegue en GitHub Actions falla con un error que no comprende.
- Hay un conflicto de Git que involucra archivos de código (`.astro`, `.js`, `.ts`, `.css`) en lugar de archivos de contenido.
- Necesita agregar una página completamente nueva al portal (requiere crear tanto el archivo JSON como el archivo `.astro`).
- Necesita modificar la estructura del CMS (agregar un campo nuevo, cambiar un tipo de widget).
- Cometió un error grave y necesita revertir varios commits.
- El sitio está mostrando un error 404 o está caído.

Para reportar un problema, incluya siempre:
1. Qué intentaba hacer.
2. Qué pasos siguió.
3. Cuál es el error que observa (captura de pantalla o texto del error).
4. La URL de la página afectada.

## Resumen del flujo de trabajo

```
Antes de empezar      →  git pull origin main
Editar archivos       →  VS Code (JSON o Markdown)
Verificar en local    →  npm run dev → http://localhost:4321
Preparar commit       →  git add [archivos]
Registrar cambio      →  git commit -m "descripción clara"
Publicar              →  git push origin main
Verificar deploy      →  GitHub → pestaña Actions → marca verde
```
