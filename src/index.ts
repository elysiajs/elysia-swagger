import { type Elysia, SCHEMA, DEFS } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

import { getAbsoluteFSPath } from 'swagger-ui-dist'

import type { OpenAPIV3 } from 'openapi-types'

import { filterPaths, formatSwagger } from './utils'
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
            excludeStaticFile = true,
            path = '/swagger' as Path,
            exclude = []
        }: ElysiaSwaggerConfig<Path> = {
            documentation: {},
            excludeStaticFile: true,
            path: '/swagger' as Path,
            exclude: []
        }
    ) =>
    (app: Elysia) => {
        app.get(path, (context) => {
            return new Response(
                `<!DOCTYPE HTML>
<html>
<head>
    <title>Redirecting...</title>
    <meta charset="utf8">
    <meta http-equiv="refresh" content="0; url=${path}/static/index.html">
    <script>
        window.location = ${path}/static/index.html
    </script>
</head>
<body>
    If you're not being redirected, use this
    <a href=${path}/static/index.html>
        link
    </a>
</body>
</html>`,
                {
                    status: 302,
                    headers: {
                        'content-type': 'text/html; charset=utf8',
                        Location: `${path}/static/index.html`
                    }
                }
            )
        })
            .get(
                `${path}/json`,
                (content) =>
                    ({
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
                        paths: filterPaths(content[SCHEMA], {
                            excludeStaticFile,
                            exclude: Array.isArray(exclude)
                                ? exclude
                                : [exclude]
                        }),
                        components: {
                            schemas: content[DEFS]
                        }
                    } satisfies OpenAPIV3.Document)
            )
            .get(
                `${path}/static/swagger-initializer.js`,
                () =>
                    new Response(formatSwagger(path), {
                        headers: {
                            'content-type': 'text/javascript; charset=utf-8'
                        }
                    })
            )
            .use(
                staticPlugin({
                    prefix: `${path}/static`,
                    assets: getAbsoluteFSPath()
                })
            )

        // This is intentional to prevent deeply nested type
        return app
    }

export default swagger
