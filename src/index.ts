import { type Elysia, SCHEMA } from 'elysia'
import { getAbsoluteFSPath } from 'swagger-ui-dist'

import { staticPlugin } from '@elysiajs/static'

import type { OpenAPIV2 } from 'openapi-types'

import { filterPaths, formatSwagger } from './utils'
import type { ElysiaSwaggerConfig } from './types'

const defaultConfig: Partial<OpenAPIV2.Document> = {
    swagger: '2.0',
    schemes: ['http', 'https'],
    consumes: ['application/json', 'text/plain'],
    produces: ['application/json', 'text/plain']
}

/**
 * Plugin for [elysia](https://github.com/elysiajs/elysia) that auto-generate Swagger page.
 *
 * @see https://github.com/elysiajs/elysia-swagger
 */
export const swagger =
    (
        {
            swagger = {},
            excludeStaticFile = true,
            path = '/swagger',
            exclude = []
        }: ElysiaSwaggerConfig = {
            swagger: {},
            excludeStaticFile: true,
            path: '/swagger',
            exclude: []
        }
    ) =>
    (app: Elysia) =>
        app
            .get(path, (context) => {
                context.set.redirect = `${path}/static/index.html`
            })
            .get(
                `${path}/static/swagger-initializer.js`,
                () =>
                    new Response(formatSwagger(path), {
                        headers: {
                            'content-type': 'text/javascript; charset=utf-8'
                        }
                    })
            )
            .get(`${path}/json`, (context) => ({
                ...{
                    ...defaultConfig,
                    ...swagger,
                    info: {
                        title: 'Elysia Documentation',
                        description: 'Developement documentation',
                        version: '0.0.0',
                        ...swagger.info
                    }
                },
                // @ts-ignore
                paths: filterPaths(context.store[SCHEMA], {
                    excludeStaticFile,
                    exclude: Array.isArray(exclude) ? exclude : [exclude]
                })
            }))
            .use(
                staticPlugin({
                    prefix: `${path}/static`,
                    path: getAbsoluteFSPath()
                })
            )

export default swagger
