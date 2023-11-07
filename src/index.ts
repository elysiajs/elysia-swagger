/* eslint-disable @typescript-eslint/ban-ts-comment */
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
            version = '5.9.0',
            excludeStaticFile = true,
            path = '/swagger' as Path,
            exclude = [],
            swaggerOptions = {},
            theme = `https://unpkg.com/swagger-ui-dist@${version}/swagger-ui.css`,
            customSwaggerUiBundleUrl = `https://unpkg.com/swagger-ui-dist@${version}/swagger-ui-bundle.js`,
            autoDarkMode = true
        }: ElysiaSwaggerConfig<Path> = {
            documentation: {},
            version: '5.9.0',
            excludeStaticFile: true,
            path: '/swagger' as Path,
            exclude: [],
            swaggerOptions: {},
            autoDarkMode: true
        }
    ) =>
    (app: Elysia) => {
        const schema = {}
        let totalRoutes = 0

        const info = {
            title: 'Elysia Documentation',
            description: 'Development documentation',
            version: '0.0.0',
            ...documentation.info
        }

        const pathWithPrefix = `${app.config.prefix}${path}`

        app.get(path, () => {
            const combinedSwaggerOptions = {
                url: `${pathWithPrefix}/json`,
                dom_id: '#swagger-ui',
                ...swaggerOptions
            }
            const stringifiedSwaggerOptions = JSON.stringify(
                combinedSwaggerOptions,
                (key, value) => {
                    if (typeof value == 'function') {
                        return undefined
                    } else {
                        return value
                    }
                }
            )


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
    ${
        autoDarkMode && typeof theme === 'string'
            ? `
    <style>
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #222;
                color: #faf9a;
            }
            .swagger-ui {
                filter: invert(92%) hue-rotate(180deg);
            }

            .swagger-ui .microlight {
                filter: invert(100%) hue-rotate(180deg);
            }
        }
    </style>`
            : ''
    }
    ${
        typeof theme === 'string'
            ? `<link rel="stylesheet" href="${theme}" />`
            : `<link rel="stylesheet" media="(prefers-color-scheme: light)" href="${theme.light}" />
<link rel="stylesheet" media="(prefers-color-scheme: dark)" href="${theme.dark}" />`
    }
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="${customSwaggerUiBundleUrl}" crossorigin></script>
    <script>
        window.onload = () => {
            window.ui = SwaggerUIBundle(${stringifiedSwaggerOptions});
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
        }).get(`${path}/json`, () => {
            const routes = app.routes as InternalRoute[]

            if (routes.length !== totalRoutes) {
                totalRoutes = routes.length

                routes.forEach((route: InternalRoute) => {
                    registerSchemaPath({
                        schema,
                        hook: route.hooks,
                        method: route.method,
                        path: route.path,
                        // @ts-ignore
                        models: app.definitions?.type,
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
                        description: 'Development documentation',
                        version: '0.0.0',
                        ...documentation.info
                    }
                },
                paths: filterPaths(schema, {
                    excludeStaticFile,
                    exclude: Array.isArray(exclude) ? exclude : [exclude]
                }),
                components: {
                    ...documentation.components,
                    schemas: {
                        // @ts-ignore
                        ...app.definitions?.type,
                        ...documentation.components?.schemas
                    }
                }
            } satisfies OpenAPIV3.Document
        })

        // This is intentional to prevent deeply nested type
        return app
    }

export default swagger
