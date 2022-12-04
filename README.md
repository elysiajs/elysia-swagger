# @elysiajs/swagger
A plugin for [elysia](https://github.com/elysiajs/elysia) to auto-generate Swagger page.

## Installation
```bash
bun add @elysiajs/swagger
```

## Example
```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger())
    .get('/', () => 'hi')
    .get('/unpath/:id', ({ params: { id } }) => id)
    .get('/unpath/:id/:name', ({ params: { id, name } }) => `${id} ${name}`)
    .post(
        '/json/:id',
        ({ body, params: { id }, query: { name } }) => ({
            ...body,
            id,
            name
        }),
        {
            schema: {
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
                })
            }
        }
    )
    .listen(8080)
```

Then go to `http://localhost:8080/swagger`.

# config

## swagger
Customize Swagger config, refers to [Swagger 2.0 config](https://swagger.io/specification/v2/)

## path
@default '/swagger'

The endpoint to expose Swagger

## excludeStaticFile
@default true

Determine if Swagger should exclude static files.

## exclude
@default []

Paths to exclude from the Swagger endpoint
