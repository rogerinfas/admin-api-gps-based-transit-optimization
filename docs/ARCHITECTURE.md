# Arquitectura del Admin (estilo Workwear)

Este admin sigue una arquitectura **orientada a features con colocation** sobre el App Router de Next.js. Cada feature vive dentro de su propia carpeta y agrupa todos los archivos que lo componen.

## Estructura de Carpetas

```
admin/
├── docs/                                # Documentación de arquitectura y guías
├── src/
│   ├── app/                             # Next.js App Router
│   │   ├── (admin)/                     # Grupo de rutas administrativas
│   │   │   └── feature-name/
│   │   │       ├── _components/         # Componentes UI del feature
│   │   │       │   ├── header/          # Encabezado y acciones de la página
│   │   │       │   ├── table/           # Tabla, columnas, filtros, acciones
│   │   │       │   ├── create/          # Diálogos / vistas de creación
│   │   │       │   ├── edit/            # Diálogos / vistas de edición
│   │   │       │   ├── detail/          # Diálogos / vistas de detalle
│   │   │       │   ├── overlays/        # Diálogos centralizados del feature
│   │   │       │   └── common/          # Reutilizables solo dentro del feature
│   │   │       ├── _hooks/              # Hooks específicos (lógica de negocio)
│   │   │       ├── _types/              # Tipos TypeScript del feature
│   │   │       ├── _schemas/            # Schemas de validación (Zod)
│   │   │       ├── _utils/              # Utilidades del feature
│   │   │       └── page.tsx             # Página principal del feature
│   │   ├── layout.tsx                   # Root layout (providers globales)
│   │   └── page.tsx                     # Landing pública
│   ├── components/                      # Componentes globales (UI compartido)
│   ├── contexts/                        # Providers (Query, Auth, etc.)
│   ├── hooks/                           # Hooks globales (paginación, filtros, etc.)
│   ├── lib/                             # Utilidades y configuración
│   │   └── api/
│   │       └── types/                   # Tipos generados desde OpenAPI
│   └── utils/                           # Helpers transversales
└── public/
```

## Convenciones de Nombres

- Archivos: `kebab-case.tsx` (`operations-table.tsx`)
- Hooks: `kebab-case-hooks.tsx` (`operations-hooks.tsx`)
- Tipos: `kebab-case.types.ts` (`operations.types.ts`)
- Schemas: `kebab-case.schema.ts`
- Componentes: `PascalCase` con `export default` para los principales

## Carpetas privadas con `_`

Las carpetas que comienzan con `_` son **internas del feature** y no deben importarse desde fuera (Next.js no las trata como rutas). Mantener el código colocalizado evita que la lógica de un módulo se filtre a otro.

## Compartir código entre features

- Si un componente es usado por **dos o más features del mismo grupo**, mover a `_shared/_components/...` al nivel del grupo. Ejemplo: `(admin)/_shared/_components/...`.
- Si solo se usa **dentro de un mismo feature**, va en `feature-name/_components/common/`.
- Si es realmente global (todas las páginas, login, etc.), usar `src/components/` o `src/lib/`.

## Patrones de imports

```ts
// Dentro del mismo feature (rutas relativas)
import { OperationsTable } from "./operations-table";
import { useOperations } from "../../_hooks/operations-hooks";

// Globales (alias @ → src/)
import { Button } from "@/components/ui/button";
import { backend } from "@/lib/api/types/backend";
```

## Reglas

1. Encapsular lógica por feature (colocation).
2. No exponer carpetas internas (`_`) hacia afuera.
3. Tipado fuerte y explícito (sin `any`).
4. Server vs Client: usar `"use client"` solo en componentes que requieran interactividad.
5. Reusar `PageShell` / `MainNavbar` y los hooks/contexts globales en lugar de duplicar.
