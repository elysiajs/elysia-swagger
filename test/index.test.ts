import { Elysia, t } from 'elysia'
import SwaggerParser from '@apidevtools/swagger-parser';
import { swagger } from '../src'

import { describe, expect, it } from 'bun:test'
import { fail } from 'assert';

const req = (path: string) => new Request(`http://localhost${path}`)

describe('Swagger', () => {
    it('show Swagger page', async () => {
        const app = new Elysia().use(swagger())

        const res = await app.handle(req('/swagger'))
        expect(res.status).toBe(200)
    })

    it('returns a valid Swagger/OpenAPI json config', async () => {
        const app = new Elysia().use(swagger())
        const res = await app.handle(req('/swagger/json')).then((x) => x.json());
        expect(res.openapi).toBe("3.0.3");
        await SwaggerParser.validate(res).catch((err) => fail(err));
    });

    it('use custom Swagger version', async () => {
        const app = new Elysia().use(
            swagger({
                version: '4.5.0'
            })
        )

        const res = await app.handle(req('/swagger')).then((x) => x.text())
        expect(
            res.includes(
                'https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js'
            )
        ).toBe(true)
    })


    it('use custom swagger bundle url', async () => {
        const app = new Elysia().use(
            swagger({
                customSwaggerUiBundleUrl: 'example.com/swagger-ui-bundle.js'
            })
        )

        const res = await app.handle(req('/swagger')).then((x) => x.text())
        expect(
            res.includes(
                'example.com/swagger-ui-bundle.js'
            )
        ).toBe(true)
    })

    it('use custom swagger css url - string', async () => {
        const app = new Elysia().use(
            swagger({
                theme: 'example.com/swagger-ui.css'
            })
        )

        const res = await app.handle(req('/swagger')).then((x) => x.text())
        expect(
            res.includes(
                'example.com/swagger-ui.css'
            )
        ).toBe(true)
    })

    it('use custom swagger css url - dark and light', async () => {
        const app = new Elysia().use(
            swagger({
                theme: {
                    dark: 'example.com/dark/swagger-ui.css',
                    light: 'example.com/light/swagger-ui.css',
                }
            })
        )

        const res = await app.handle(req('/swagger')).then((x) => x.text())
        expect(
            res.includes(
                'example.com/dark/swagger-ui.css'
            )
        ).toBe(true)
        expect(
            res.includes(
                'example.com/light/swagger-ui.css'
            )
        ).toBe(true)
    })

    it('follow title and description', async () => {
        const app = new Elysia().use(
            swagger({
                version: '4.5.0',
                documentation: {
                    info: {
                        title: 'Elysia Documentation',
                        description: 'Herrscher of Human',
                        version: '1.0.0'
                    }
                }
            })
        )

        const res = await app.handle(req('/swagger')).then((x) => x.text())

        expect(res.includes('<title>Elysia Documentation</title>')).toBe(true)
        expect(
            res.includes(
                `<meta
        name="description"
        content="Herrscher of Human"
    />`
            )
        ).toBe(true)
    })

    it('use custom path', async () => {
        const app = new Elysia().use(
            swagger({
                path: '/v2/swagger'
            })
        )

        const res = await app.handle(req('/v2/swagger'))
        expect(res.status).toBe(200)

        const resJson = await app.handle(req('/v2/swagger/json'))
        expect(resJson.status).toBe(200)
    })

    it('Swagger UI options', async () => {
        const app = new Elysia().use(
            swagger({
                swaggerOptions: {
                    persistAuthorization: true
                }
            })
        )
        const res = await app.handle(req('/swagger')).then((x) => x.text())
        const expected = `"persistAuthorization":true`

        expect(res.trim().includes(expected.trim())).toBe(true)
    })

    it('should not return content response when using Void type', async () => {
        const app = new Elysia().use(swagger()).get('/void', () => {}, {
            response: {
                204: t.Void({
                    description: 'Void response'
                })
            }
        })

        const res = await app.handle(req('/swagger/json'))
        expect(res.status).toBe(200)
        const response = await res.json()
        expect(response.paths['/void'].get.responses['204'].description).toBe(
            'Void response'
        )
        expect(
            response.paths['/void'].get.responses['204'].content
        ).toBeUndefined()
    })

    it('should not return content response when using Undefined type', async () => {
        const app = new Elysia()
            .use(swagger())
            .get('/undefined', () => undefined, {
                response: {
                    204: t.Undefined({
                        description: 'Undefined response'
                    })
                }
            })

        const res = await app.handle(req('/swagger/json'))
        expect(res.status).toBe(200)
        const response = await res.json()
        expect(
            response.paths['/undefined'].get.responses['204'].description
        ).toBe('Undefined response')
        expect(
            response.paths['/undefined'].get.responses['204'].content
        ).toBeUndefined()
    })

    it('should not return content response when using Null type', async () => {
        const app = new Elysia().use(swagger()).get('/null', () => null, {
            response: {
                204: t.Null({
                    description: 'Null response'
                })
            }
        })

        const res = await app.handle(req('/swagger/json'))
        expect(res.status).toBe(200)
        const response = await res.json()
        expect(response.paths['/null'].get.responses['204'].description).toBe(
            'Null response'
        )
        expect(
            response.paths['/null'].get.responses['204'].content
        ).toBeUndefined()
    })
})
