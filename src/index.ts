import { type Elysia, type InternalRoute } from 'elysia'

import { filterPaths, registerSchemaPath } from './utils'

import type { OpenAPIV3 } from 'openapi-types'
import type { ElysiaSwaggerConfig } from './types'

/**
 * Plugin for [elysia](https://github.com/elysiajs/elysia) that auto-generate Swagger page.
 *
 * @see https://github.com/elysiajs/elysia-swagger
 */
export const swagger =
    <Path extends string = '/swagger'>(
        {
            documentation = {},
            version = '4.18.2',
            excludeStaticFile = true,
            path = '/swagger' as Path,
            exclude = []
        }: ElysiaSwaggerConfig<Path> = {
            documentation: {},
            version: '4.18.2',
            excludeStaticFile: true,
            path: '/swagger' as Path,
            exclude: []
        }
    ) =>
    (app: Elysia) => {
        const schema = {}
        let totalRoutes = 0

        const info = {
            title: 'Elysia Documentation',
            description: 'Developement documentation',
            version: '0.0.0',
            ...documentation.info
        }

        app.get(path, () => {
            return new Response(
                `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${info.title}</title>
    <meta
        name="description"
        content="${info.description}"
    />
    <meta
        name="og:description"
        content="${info.description}"
    />
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@${version}/swagger-ui.css" />
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@${version}/swagger-ui-bundle.js" crossorigin></script>
    <script>
        window.onload = () => {
            window.ui = SwaggerUIBundle({
                url: '${path}/json',
                dom_id: '#swagger-ui',
            });
        };
    </script>
</body>
</html>`,
                {
                    headers: {
                        'content-type': 'text/html; charset=utf8'
                    }
                }
            )
        }).route(
            'GET',
            `${path}/json`,
            () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const routes = app.routes as InternalRoute[]

                if (routes.length !== totalRoutes) {
                    totalRoutes = routes.length

                    routes.forEach((route: InternalRoute<any>) => {
                        registerSchemaPath({
                            schema,
                            hook: route.hooks,
                            method: route.method,
                            path: route.path,
                            models: app.meta.defs,
                            contentType: route.hooks.type
                        })
                    })
                }

                return {
                    openapi: '3.0.3',
                    ...{
                        ...documentation,
                        info: {
                            title: 'Elysia Documentation',
                            description: 'Developement documentation',
                            version: '0.0.0',
                            ...documentation.info
                        }
                    },
                    paths: filterPaths(schema, {
                        excludeStaticFile,
                        exclude: Array.isArray(exclude) ? exclude : [exclude]
                    }),
                    components: {
                        schemas: app.meta.defs
                    }
                } satisfies OpenAPIV3.Document
            }
        )

        // This is intentional to prevent deeply nested type
        return app
    }

export default swagger
