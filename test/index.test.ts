import { Elysia, t } from 'elysia'
import SwaggerParser from '@apidevtools/swagger-parser'
import { swagger } from '../src'

import { describe, expect, it } from 'bun:test'
import { fail } from 'assert'

const req = (path: string) => new Request(`http://localhost${path}`)

describe('Swagger', () => {
	it('show Swagger page', async () => {
		const app = new Elysia().use(swagger())

		await app.modules

		const res = await app.handle(req('/swagger'))
		expect(res.status).toBe(200)
	})

	it('returns a valid Swagger/OpenAPI json config', async () => {
		const app = new Elysia().use(swagger())

		await app.modules

		const res = await app.handle(req('/swagger/json')).then((x) => x.json())
		expect(res.openapi).toBe('3.0.3')
		await SwaggerParser.validate(res).catch((err) => fail(err))
	})

	it('use custom Swagger version', async () => {
		const app = new Elysia().use(
			swagger({
				provider: 'swagger-ui',
				version: '4.5.0'
			})
		)

		await app.modules

		const res = await app.handle(req('/swagger')).then((x) => x.text())
		expect(
			res.includes(
				'https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js'
			)
		).toBe(true)
	})

	it('follow title and description with Swagger-UI provider', async () => {
		const app = new Elysia().use(
			swagger({
				version: '4.5.0',
				provider: 'swagger-ui',
				documentation: {
					info: {
						title: 'Elysia Documentation',
						description: 'Herrscher of Human',
						version: '1.0.0'
					}
				}
			})
		)

		await app.modules

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

	it('follow title and description with Scalar provider', async () => {
		const app = new Elysia().use(
			swagger({
				version: '4.5.0',
				provider: 'scalar',
				documentation: {
					info: {
						title: 'Elysia Documentation',
						description: 'Herrscher of Human',
						version: '1.0.0'
					}
				}
			})
		)

		await app.modules

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

		await app.modules

		const res = await app.handle(req('/v2/swagger'))
		expect(res.status).toBe(200)

		const resJson = await app.handle(req('/v2/swagger/json'))
		expect(resJson.status).toBe(200)
	})

	it('Swagger UI options', async () => {
		const app = new Elysia().use(
			swagger({
				provider: 'swagger-ui',
				swaggerOptions: {
					persistAuthorization: true
				}
			})
		)

		await app.modules

		const res = await app.handle(req('/swagger')).then((x) => x.text())
		const expected = `"persistAuthorization":true`

		expect(res.trim().includes(expected.trim())).toBe(true)
	})

	it('OpenAPI version', async () => {
		const app = new Elysia().use(
			swagger({
				openapi: '3.1.0'
			})
		)

		await app.modules

		const res = await app.handle(req('/swagger/json')).then((x) => x.json())
		expect(res.openapi).toBe('3.1.0')
	})

	it('should not return content response when using Void type', async () => {
		const app = new Elysia().use(swagger()).get('/void', () => {}, {
			response: {
				204: t.Void({
					description: 'Void response'
				})
			}
		})

		await app.modules

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

		await app.modules

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

		await app.modules

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

	it('should set the required field to true when a request body is present', async () => {
		const app = new Elysia().use(swagger()).post('/post', () => {}, {
			body: t.Object({ name: t.String() })
		})

		await app.modules

		const res = await app.handle(req('/swagger/json'))
		expect(res.status).toBe(200)
		const response = await res.json()
		expect(response.paths['/post'].post.requestBody.required).toBe(true)
	})

	it('resolve optional param to param', async () => {
		const app = new Elysia().use(swagger()).get('/id/:id?', () => {})

		await app.modules

		const res = await app.handle(req('/swagger/json'))
		expect(res.status).toBe(200)
		const response = await res.json()
		expect(response.paths).toContainKey('/id/{id}')
	})

	it('should hide routes with hide = true from paths', async () => {
		const app = new Elysia().use(swagger())
			.get("/public", "omg")
			.guard({
				detail: {
					hide: true
				}
			})
			.get("/hidden", "ok")

		await app.modules

		const res = await app.handle(req('/swagger/json'))
		expect(res.status).toBe(200)
		const response = await res.json()
		expect(response.paths['/public']).not.toBeUndefined();
		expect(response.paths['/hidden']).toBeUndefined();
	})

	it('should expand .all routes', async () => {
		const app = new Elysia().use(swagger())
			.all("/all", "woah")

		await app.modules

		const res = await app.handle(req('/swagger/json'))
		expect(res.status).toBe(200)
		const response = await res.json()
		expect(Object.keys(response.paths['/all'])).toBeArrayOfSize(8)
	})

	it('should hide routes that are invalid', async () => {
		const app = new Elysia().use(swagger())
			.get("/valid", "ok")
			.route("LOCK", "/invalid", "nope")

		await app.modules

		const res = await app.handle(req('/swagger/json'))
		expect(res.status).toBe(200)
		const response = await res.json()
		expect(response.paths['/valid']).not.toBeUndefined();
		expect(response.paths['/invalid']).toBeUndefined();

	})
})
