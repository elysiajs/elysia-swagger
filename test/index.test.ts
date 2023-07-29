import { Elysia } from 'elysia'
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

    it('use custom spec path', async () => {
        const app = new Elysia().use(
            swagger({
                path: '/v2/swagger',
                specPathname: 'openapi.json'
            })
        )

        const res = await app.handle(req('/v2/swagger/openapi.json'))
        expect(res.status).toBe(200)
        expect(res.headers.get('content-type')).toContain('application/json')
    })
})
