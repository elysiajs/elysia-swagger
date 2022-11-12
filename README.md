# @kingworldjs/swagger
A plugin for [kingworld](https://github.com/saltyaom/kingworld) that auto-generate Swagger page.

## Installation
```bash
bun add @kingworldjs/swagger
```

## Example
```typescript
import KingWorld from 'kingworld'
import swagger from '@kingworldjs/swagger'

const app = new KingWorld()
    .use(swagger)
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

Paths to exclude from Swagger endpoint
