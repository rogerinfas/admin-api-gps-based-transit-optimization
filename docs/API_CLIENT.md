# Cliente de API tipado (TanStack Query + OpenAPI)

Este admin se conecta al backend NestJS usando **tipos generados desde el OpenAPI** del API. Esto garantiza que cualquier cambio en los DTOs del backend se refleje al instante en TypeScript en el front.

## Stack

- [`openapi-typescript`](https://github.com/drwpow/openapi-typescript) → genera `paths` y `components` desde el JSON del API.
- [`openapi-fetch`](https://openapi-ts.dev/openapi-fetch/) → cliente `fetch` tipado.
- [`openapi-react-query`](https://openapi-ts.dev/openapi-react-query/) → wrapper de React Query basado en los tipos.
- [`@tanstack/react-query`](https://tanstack.com/query) → manejo de estado de servidor.
- [`@tanstack/react-query-devtools`](https://tanstack.com/query/latest/docs/react/devtools) → herramientas en desarrollo.

## Flujo

1. La API expone un OpenAPI JSON en `api-gps-based-transit-optimization/generated/openapi-schema.json`.
2. El admin lo consume con el script `pnpm generate` (o `npm run generate`).
3. Los tipos se escriben en `src/lib/api/types/api.ts`.
4. El cliente tipado se crea en `src/lib/api/types/backend.ts`:
   ```ts
   import createFetchClient from "openapi-fetch";
   import createClient from "openapi-react-query";
   import { paths } from "./api";

   const fetchClient = createFetchClient<paths>({ baseUrl });
   export const backend = createClient(fetchClient);
   ```
5. Cualquier hook usa el cliente con autocompletado completo:
   ```ts
   const { data } = backend.useQuery("get", "/routes");
   const { data } = backend.useQuery("get", "/vehicles/{id}", {
     params: { path: { id } },
   });
   ```

## Generación de tipos

En el API, anotar siempre los DTOs con `@nestjs/swagger`:

```ts
@ApiProperty({ description: "...", example: "..." })
field!: string;
```

En el admin:

```bash
npm run generate
```

Esto re-genera `src/lib/api/types/api.ts` desde el OpenAPI JSON.

## Convenciones de hooks

Cada feature define hooks que envuelven `backend.useQuery` / `backend.useMutation` con `queryKey` consistente para invalidaciones:

```ts
export const useGetRoutes = () =>
  backend.useQuery("get", "/routes");

export const useCreateRoute = () => {
  const queryClient = useQueryClient();
  return backend.useMutation("post", "/routes", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (q) =>
          (q.queryKey[1] as string | undefined)?.includes("/routes") ?? false,
      });
    },
  });
};
```

## Variables de entorno

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

> El admin nunca debe tocar `process.env.*` sin el prefijo `NEXT_PUBLIC_` cuando se usa en el cliente.
