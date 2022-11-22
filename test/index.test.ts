import KingWorld from 'kingworld'

import swagger from '../src'

import { describe, expect, it } from 'bun:test'

const req = (path: string) => new Request(path)

describe('Swagger', () => {
    it('redirect to Swagger page', async () => {
        const app = new KingWorld().use(swagger())

        const res = await app.handle(req('/swagger'))
        expect(res.status).toBe(302)
    })

    it('use custom path', async () => {
        const app = new KingWorld().use(
            swagger({
                path: '/v2/swagger'
            })
        )

        const res = await app.handle(req('/v2/swagger'))
        expect(res.status).toBe(302)
    })
})
