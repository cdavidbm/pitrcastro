/**
 * "Contenido del sitio" — punto de entrada para editar, organizado como el
 * menú del portal en vez de como la lista plana del Content Manager.
 *
 * Dos selectores en cascada: primero la sección del menú, después el grupo
 * dentro de esa sección. Abajo, las páginas de ese grupo. Al elegir una, se
 * abre el editor normal de Strapi.
 *
 * El árbol se genera con `node cms-strapi/scripts/gen-nav-tree.mjs`, que cruza
 * el menú de navegación del sitio con la curación de nav-tree-grupos.json.
 * Esta pantalla solo lo dibuja: para mover algo de lugar, se edita ese archivo
 * y se vuelve a generar, sin tocar código.
 */

import * as React from 'react';
import {
  Badge,
  Box,
  Divider,
  Field,
  Flex,
  Main,
  SingleSelect,
  SingleSelectOption,
  Typography,
} from '@strapi/design-system';
import { Link } from 'react-router-dom';

import navTree from '../nav-tree.json';

type Item = {
  uid: string;
  slug: string;
  kind: 'single' | 'collection';
  label: string;
  url: string | null;
};
type Grupo = { label: string; items: Item[] };
type Rama = { label: string; url: string | null; grupos: Grupo[] };

const RAMAS = (navTree as { ramas: Rama[] }).ramas;

/** Opción del segundo selector que muestra la rama completa. */
const TODOS = '*';

const RECUERDA_RAMA = 'itrc-panel-rama';
const RECUERDA_GRUPO = 'itrc-panel-grupo';

const leerRecuerdo = (clave: string): string | null => {
  try {
    return localStorage.getItem(clave);
  } catch {
    return null;
  }
};

const guardarRecuerdo = (clave: string, valor: string) => {
  try {
    localStorage.setItem(clave, valor);
  } catch {
    /* modo privado del navegador: seguir sin recordar */
  }
};

/**
 * Ruta del editor de Strapi para un tipo de contenido.
 *
 * Alimenta un enlace de verdad (`<Link>`), no un botón con manejador de clic:
 * así la fila se comporta como cualquier enlace —se puede abrir en otra
 * pestaña— y no depende de que un evento llegue a su destino.
 */
const rutaDelEditor = (item: Item) =>
  item.kind === 'collection'
    ? `/content-manager/collection-types/${item.uid}`
    : `/content-manager/single-types/${item.uid}`;

const ContenidoDelSitio = () => {

  const [ramaElegida, setRamaElegida] = React.useState<string>(() => {
    const guardada = leerRecuerdo(RECUERDA_RAMA);
    return guardada && RAMAS.some((r) => r.label === guardada) ? guardada : RAMAS[0].label;
  });

  const rama = RAMAS.find((r) => r.label === ramaElegida) || RAMAS[0];

  const [grupoElegido, setGrupoElegido] = React.useState<string>(() => {
    const guardado = leerRecuerdo(RECUERDA_GRUPO);
    return guardado || TODOS;
  });

  // Si el grupo recordado no existe en la rama actual, se muestra todo.
  const grupoValido =
    grupoElegido === TODOS || rama.grupos.some((g) => g.label === grupoElegido)
      ? grupoElegido
      : TODOS;

  const gruposVisibles =
    grupoValido === TODOS ? rama.grupos : rama.grupos.filter((g) => g.label === grupoValido);

  const totalRama = rama.grupos.reduce((n, g) => n + g.items.length, 0);
  const totalVisible = gruposVisibles.reduce((n, g) => n + g.items.length, 0);

  const cambiarRama = (valor: string) => {
    setRamaElegida(valor);
    setGrupoElegido(TODOS);
    guardarRecuerdo(RECUERDA_RAMA, valor);
    guardarRecuerdo(RECUERDA_GRUPO, TODOS);
  };

  const cambiarGrupo = (valor: string) => {
    setGrupoElegido(valor);
    guardarRecuerdo(RECUERDA_GRUPO, valor);
  };

  return (
    <Main>
      <Box paddingLeft={10} paddingRight={10} paddingTop={8} paddingBottom={4}>
        <Typography variant="alpha" tag="h1">
          Contenido del sitio
        </Typography>
        <Box paddingTop={2}>
          <Typography variant="epsilon" textColor="neutral600">
            Elija la sección del portal y luego el grupo. Las páginas aparecen abajo,
            tal como están organizadas en el sitio publicado.
          </Typography>
        </Box>
      </Box>

      <Box paddingLeft={10} paddingRight={10} paddingBottom={6}>
        <Flex gap={4} alignItems="flex-end" wrap="wrap">
          <Box style={{ minWidth: '20rem', flex: '1 1 20rem' }}>
            <Field.Root name="rama">
              <Field.Label>Sección del sitio</Field.Label>
              <SingleSelect
                value={ramaElegida}
                onChange={(v: string | number) => cambiarRama(String(v))}
              >
                {RAMAS.map((r) => {
                  const n = r.grupos.reduce((acc, g) => acc + g.items.length, 0);
                  return (
                    <SingleSelectOption key={r.label} value={r.label}>
                      {`${r.label} (${n})`}
                    </SingleSelectOption>
                  );
                })}
              </SingleSelect>
            </Field.Root>
          </Box>

          <Box style={{ minWidth: '20rem', flex: '1 1 20rem' }}>
            <Field.Root name="grupo">
              <Field.Label>Grupo</Field.Label>
              <SingleSelect
                value={grupoValido}
                onChange={(v: string | number) => cambiarGrupo(String(v))}
              >
                <SingleSelectOption value={TODOS}>
                  {`Todos los grupos (${totalRama})`}
                </SingleSelectOption>
                {rama.grupos.map((g) => (
                  <SingleSelectOption key={g.label} value={g.label}>
                    {`${g.label} (${g.items.length})`}
                  </SingleSelectOption>
                ))}
              </SingleSelect>
            </Field.Root>
          </Box>
        </Flex>
      </Box>

      <Box paddingLeft={10} paddingRight={10} paddingBottom={10}>
        <Box paddingBottom={2}>
          <Typography variant="pi" textColor="neutral500">
            {totalVisible === 1 ? '1 página' : `${totalVisible} páginas`}
          </Typography>
        </Box>

        {gruposVisibles.map((grupo) => (
          <Box key={grupo.label} paddingBottom={6}>
            {grupoValido === TODOS && (
              <Box paddingTop={4} paddingBottom={3}>
                <Typography variant="delta" tag="h2">
                  {grupo.label}
                </Typography>
              </Box>
            )}

            <Box
              background="neutral0"
              hasRadius
              shadow="tableShadow"
              borderColor="neutral150"
              borderWidth="1px"
              borderStyle="solid"
            >
              {grupo.items.map((item, i) => (
                <React.Fragment key={item.uid}>
                  {i > 0 && <Divider />}
                  <Link
                    to={rutaDelEditor(item)}
                    style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                  >
                    <Box paddingTop={4} paddingBottom={4} paddingLeft={5} paddingRight={5}>
                      <Flex justifyContent="space-between" alignItems="center" gap={4}>
                        <Box>
                          <Typography variant="omega" fontWeight="semiBold" textColor="neutral800">
                            {item.label}
                          </Typography>
                          <Box paddingTop={1}>
                            <Typography variant="pi" textColor="neutral500">
                              {item.url || 'Sin página propia — se muestra dentro de otra'}
                            </Typography>
                          </Box>
                        </Box>
                        {item.kind === 'collection' && (
                          <Badge backgroundColor="secondary100" textColor="secondary600">
                            Listado
                          </Badge>
                        )}
                      </Flex>
                    </Box>
                  </Link>
                </React.Fragment>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Main>
  );
};

export default ContenidoDelSitio;
