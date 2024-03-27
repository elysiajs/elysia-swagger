# @elysiajs/swagger
Plugin for [elysia](https://github.com/elysiajs/elysia) to auto-generate Swagger page.

## Installation
```bash
bun add @elysiajs/swagger
```

## Example
```typescript
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger())
    .get('/', () => 'hi', { response: t.String({ description: 'sample description' }) })
    .post(
        '/json/:id',
        ({ body, params: { id }, query: { name } }) => ({
            ...body,
            id,
            name
        }),
        {
            params: t.Object({
                id: t.String()
            }),
            query: t.Object({
                name: t.String()
            }),
            body: t.Object({
                username: t.String(),
                password: t.String()
            }),
            response: t.Object({
                username: t.String(),
                password: t.String(),
                id: t.String(),
                name: t.String()
            }, { description: 'sample description' })
        }
    )
    .listen(8080);
```

Then go to `http://localhost:8080/swagger`.

# config

## provider
@default 'scalar'
Choose between [Scalar](https://swagger.io/specification/v2/) & [SwaggerUI](https://github.com/swagger-api/swagger-ui)

## scalar
Customize scalarConfig, refers to [Scalar config](https://github.com/scalar/scalar)

## swagger
Customize Swagger config, refers to [Swagger 3.0.3 config](https://swagger.io/specification/v3/)

## path
@default '/swagger'

The endpoint to expose Swagger

## excludeStaticFile
@default true

Determine if Swagger should exclude static files.

## exclude
@default []

Paths to exclude from the Swagger endpoint
