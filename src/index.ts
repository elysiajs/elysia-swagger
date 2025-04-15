/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Elysia, type InternalRoute } from 'elysia'

import { SwaggerUIRender } from './swagger'
import { ScalarRender } from './scalar'

import { filterPaths, registerSchemaPath } from './utils'

import type { OpenAPIV3 } from 'openapi-types'
import type { ReferenceConfiguration } from '@scalar/types'
import type { ElysiaSwaggerConfig } from './types'
import { RapidocRender } from "./rapidoc";

/**
 * Plugin for [elysia](https://github.com/elysiajs/elysia) that auto-generate Swagger page.
 *
 * @see https://github.com/elysiajs/elysia-swagger
 */
export const swagger = async <Path extends string = '/swagger'>(
	{
		provider = 'scalar',
		scalarVersion = 'latest',
		scalarCDN = '',
		scalarConfig = {},
		rapidocConfig = {},
		documentation = {},
		version = '5.9.0',
		excludeStaticFile = true,
		path = '/swagger' as Path,
		exclude = [],
		swaggerOptions = {},
		theme = `https://unpkg.com/swagger-ui-dist@${version}/swagger-ui.css`,
		autoDarkMode = true,
		excludeMethods = ['OPTIONS'],
		excludeTags = []
	}: ElysiaSwaggerConfig<Path> = {
		provider: 'scalar',
		scalarVersion: 'latest',
		scalarCDN: '',
		scalarConfig: {},
		rapidocConfig: {},
		documentation: {},
		version: '5.9.0',
		excludeStaticFile: true,
		path: '/swagger' as Path,
		exclude: [],
		swaggerOptions: {},
		autoDarkMode: true,
		excludeMethods: ['OPTIONS'],
		excludeTags: []
	}
) => {
	const schema = {}
	let totalRoutes = 0

	if (!version)
		version = `https://unpkg.com/swagger-ui-dist@${version}/swagger-ui.css`

	const info = {
		title: 'Elysia Documentation',
		description: 'Development documentation',
		version: '0.0.0',
		...documentation.info
	}

	const relativePath = path.startsWith('/') ? path.slice(1) : path

	const openAPISpecUrl = relativePath === '' ? `/json` : `/${relativePath}/json`

	const app = new Elysia({ name: '@elysiajs/swagger' })

	app.get(path, function documentation({request}) {
		const combinedSwaggerOptions = {
			url: openAPISpecUrl,
			dom_id: '#swagger-ui',
			...swaggerOptions
		}

		const stringifiedSwaggerOptions = JSON.stringify(
			combinedSwaggerOptions,
			(key, value) => {
				if (typeof value == 'function') return undefined

				return value
			}
		)

		const scalarConfiguration: ReferenceConfiguration = {
			spec: {
				...scalarConfig.spec,
				url: `${new URL(request.url).pathname.replace(/\/$/, "")}/json`
			},
			...scalarConfig,
			// so we can showcase the elysia theme
			// @ts-expect-error
			_integration: 'elysiajs'
		}

		let html: string
		switch (provider) {
			case 'scalar':
				html = ScalarRender(info, scalarVersion, scalarConfiguration, scalarCDN)
				break
			case 'swagger-ui':
				html = SwaggerUIRender(
					info,
					version,
					theme,
					stringifiedSwaggerOptions,
					autoDarkMode
				)
				break
			case 'rapidoc':
				html = RapidocRender(info, {
					specUrl: openAPISpecUrl,

					allowAdvancedSearch: true,
					allowSpecFileDownload: true,
					defaultSchemaTab: 'schema',
					fillRequestFieldsWithExample: false,
					headingText: info.title,
					layout: 'column',
					loadFonts: true,
					persistAuth: true,
					renderStyle: 'focused',
					schemaDescriptionExpanded: true,
					schemaExpandLevel: 10,
					schemaStyle: 'table',
					showHeader: false,
					showMethodInNavBar: 'as-colored-block',
					theme: 'light',
					usePathInNavBar: true,

					...rapidocConfig
				})
				break

		}

		return new Response(html, {
			headers: {
					'content-type': 'text/html; charset=utf8'
				}
			}
		)
	}).get(path === '/' ? '/json' : `${path}/json`, function openAPISchema() {
		// @ts-expect-error Private property
		const routes = app.getGlobalRoutes() as InternalRoute[]

		if (routes.length !== totalRoutes) {
			const ALLOWED_METHODS = ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH', 'TRACE']
			totalRoutes = routes.length

			// forEach create a clone of a route (can't use for-of)
			routes.forEach((route: InternalRoute) => {
				if (route.hooks?.detail?.hide === true) return
				// TODO: route.hooks?.detail?.hide !== false  add ability to hide: false to prevent excluding
				if (excludeMethods.includes(route.method)) return
				if (ALLOWED_METHODS.includes(route.method) === false && route.method !== 'ALL') return

				if (route.method === 'ALL') {
					ALLOWED_METHODS.forEach((method) => {
						registerSchemaPath({
							schema,
							hook: route.hooks,
							method,
							path: route.path,
							// @ts-ignore
							models: app.definitions?.type,
							contentType: route.hooks.type
						})
					})
					return
				}

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
				tags: documentation.tags?.filter(
					(tag) => !excludeTags?.includes(tag?.name)
				),
				info: {
					title: 'Elysia Documentation',
					description: 'Development documentation',
					version: '0.0.0',
					...documentation.info
				}
			},
			paths: {
				...filterPaths(schema, relativePath, {
					excludeStaticFile,
					exclude: Array.isArray(exclude) ? exclude : [exclude]
				}),
				...documentation.paths
			},
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

	return app
}

export type { ElysiaSwaggerConfig }
export default swagger
