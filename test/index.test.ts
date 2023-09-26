import { Elysia, t } from 'elysia'
import { swagger } from '../src'

import { describe, expect, it } from 'bun:test'

const req = (path: string) => new Request(`http://localhost${path}`)

describe('Swagger', () => {
    it('show Swagger page', async () => {
        const app = new Elysia().use(swagger())

        const res = await app.handle(req('/swagger'))
        expect(res.status).toBe(200)
    })

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
        const expected = `
        window.onload = () => {
            window.ui = SwaggerUIBundle({"url":"/swagger/json","dom_id":"#swagger-ui","persistAuthorization":true});
        };
        `
        expect(res.trim().includes(expected.trim())).toBe(true)
    })

    it('should not return content response when using Void type', async () => {
        const app = new Elysia().use(
            swagger())
            .get('/void', () => {}, {
                response: { 204: t.Void({
                    description: 'Void response'
            })}});

        const res = await app.handle(req('/swagger/json'))
        expect(res.status).toBe(200)
        const response = await res.json();
        expect(response.paths['/void'].get.responses['204'].description).toBe('Void response');
        expect(response.paths['/void'].get.responses['204'].content).toBeUndefined();
    })

    it('should not return content response when using Undefined type', async () => {
        const app = new Elysia().use(
            swagger())
            .get('/undefined', () => undefined, {
                response: { 204: t.Undefined({
                    description: 'Undefined response'
            })}});

        const res = await app.handle(req('/swagger/json'))
        expect(res.status).toBe(200)
        const response = await res.json();
        expect(response.paths['/undefined'].get.responses['204'].description).toBe('Undefined response');
        expect(response.paths['/undefined'].get.responses['204'].content).toBeUndefined();
    })

    it('should not return content response when using Null type', async () => {
        const app = new Elysia().use(
            swagger())
            .get('/null', () => null, {
                response: { 204: t.Null({
                    description: 'Null response'
            })}});

        const res = await app.handle(req('/swagger/json'))
        expect(res.status).toBe(200)
        const response = await res.json();
        expect(response.paths['/null'].get.responses['204'].description).toBe('Null response');
        expect(response.paths['/null'].get.responses['204'].content).toBeUndefined();
    })
})
