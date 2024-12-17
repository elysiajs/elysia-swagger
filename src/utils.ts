/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { normalize } from 'pathe'
import type { HTTPMethod, LocalHook } from 'elysia'

import { Kind, type TSchema } from '@sinclair/typebox'
import type { OpenAPIV3 } from 'openapi-types'

export const toOpenAPIPath = (path: string) =>
	path
		.split('/')
		.map((x) => {
			if (x.startsWith(':')) {
				x = x.slice(1, x.length)
				if (x.endsWith('?')) x = x.slice(0, -1)
				x = `{${x}}`
			}

			return x
		})
		.join('/')

export const mapProperties = (
	name: string,
	schema: TSchema | string | undefined,
	models: Record<string, TSchema>
): (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[] => {
	if (schema === undefined) return []

	if (typeof schema === 'string') {
		if (schema in models) schema = models[schema]
		else throw new Error(`Can't find model ${schema}`)
	}

	// this is used by parameters (query, headers...) and we only support
	// object like schemas.
	return Object.entries(schema?.properties as Record<string, TSchema> ?? []).map(([key, value]) => {
		const {
			type: valueType = undefined,
			description,
			examples,
			...schemaKeywords
		} = value;
		return {
			description,
			examples,
			schema: { type: valueType, ...schemaKeywords },
			in: name,
			name: key,
			required: schema!.required?.includes(key) ?? false
		}
	})
}

const mapTypesResponse = (
	types: string[],
	schema: string | TSchema
) => {
	if (
		typeof schema === 'object' &&
		['void', 'undefined', 'null'].includes(schema.type)
	)
		return

	const responses: Record<string, OpenAPIV3.MediaTypeObject> = {}

	for (const type of types) {
		responses[type] = {
			schema:
				typeof schema === 'string'
					? { $ref: `#/components/schemas/${schema}` }
					: schema
		}
	}

	return responses
}

export const capitalize = (word: string) =>
	word.charAt(0).toUpperCase() + word.slice(1)

export const generateOperationId = (method: string, paths: string) => {
	let operationId = method.toLowerCase()

	if (paths === '/') return operationId + 'Index'

	for (const path of paths.split('/')) {
		if (path.charCodeAt(0) === 123) {
			operationId += 'By' + capitalize(path.slice(1, -1))
		} else {
			operationId += capitalize(path)
		}
	}

	return operationId
}

const cloneHook = <T>(hook: T) => {
	if (!hook) return
	if (typeof hook === 'string') return hook
	if (Array.isArray(hook)) return [...hook]
	return { ...hook }
}

export const registerSchemaPath = ({
	schema,
	path,
	method,
	hook,
	models
}: {
	schema: Partial<OpenAPIV3.PathsObject>
	contentType?: string | string[]
	path: string
	method: HTTPMethod
	hook?: LocalHook<any, any, any, any, any, any>
	models: Record<string, TSchema>
}) => {
	hook = cloneHook(hook)

	const contentType = hook?.type ?? [
		'application/json',
		'multipart/form-data',
		'text/plain'
	]

	path = toOpenAPIPath(path)

	const contentTypes =
		typeof contentType === 'string'
			? [contentType]
			: (contentType ?? ['application/json'])

	const bodySchema = cloneHook(hook?.body)
	const paramsSchema = cloneHook(hook?.params)
	const headerSchema = cloneHook(hook?.headers)
	const querySchema = cloneHook(hook?.query)
	let responseSchema: OpenAPIV3.ResponsesObject = cloneHook(hook?.response)

	if (typeof responseSchema === 'object') {
		if (Kind in responseSchema) {
			const value = responseSchema as TSchema;
			responseSchema = {
				'200': {
					description: value.description ?? "",
					headers: value.headers,
					content: mapTypesResponse(contentTypes, value),
					links: value.links,
				}
			}
		} else {
			Object.entries(responseSchema as Record<string, TSchema | string>).forEach(
				([key, value]) => {
					const model = typeof value === 'string' ? models[value] : value;
					if (!model) return;
					responseSchema[key] = {
						description: model.description ?? "",
						headers: model.headers,
						links: model.links,
						content: mapTypesResponse(contentTypes, model),
					}
				}
			)
		}
	} else if (typeof responseSchema === 'string') {
		const value = models[responseSchema];
		if (!value) return

		responseSchema = {
			'200': {
				description: value.description ?? "",
				headers: value.headers,
				links: value.links,
				content: mapTypesResponse(contentTypes, value)
			}
		}
	}

	const parameters = [
		...mapProperties('header', headerSchema, models),
		...mapProperties('path', paramsSchema, models),
		...mapProperties('query', querySchema, models)
	]

	schema[path] = {
		...(schema[path] ? schema[path] : {}),
		[method.toLowerCase()]: {
			parameters,
			responses: responseSchema,
			operationId: hook?.detail?.operationId ?? generateOperationId(method, path),
			...hook?.detail,
			requestBody: bodySchema ? {
				required: true,
				content: mapTypesResponse(contentTypes, bodySchema)
			} : undefined,
		}
	}
}

export const filterPaths = (
	paths: Record<string, any>,
	docsPath: string,
	{
		excludeStaticFile = true,
		exclude = []
	}: {
		excludeStaticFile: boolean
		exclude: (string | RegExp)[]
	}
) => {
	const newPaths: Record<string, any> = {}

	// exclude docs path and OpenAPI json path
	const excludePaths = [`/${docsPath}`, `/${docsPath}/json`].map((p) =>
		normalize(p)
	)

	for (const [key, value] of Object.entries(paths))
		if (
			!exclude.some((x) => {
				if (typeof x === 'string') return key === x

				return x.test(key)
			}) &&
			!excludePaths.includes(key) &&
			!key.includes('*') &&
			(excludeStaticFile ? !key.includes('.') : true)
		) {
			Object.keys(value).forEach((method) => {
				const schema = value[method]

				if (key.includes('{')) {
					if (!schema.parameters) schema.parameters = []

					schema.parameters = [
						...key
							.split('/')
							.filter(
								(x) =>
									x.startsWith('{') &&
									!schema.parameters.find(
										(params: Record<string, any>) =>
											params.in === 'path' &&
											params.name ===
												x.slice(1, x.length - 1)
									)
							)
							.map((x) => ({
								schema: { type: 'string' },
								in: 'path',
								name: x.slice(1, x.length - 1),
								required: true
							})),
						...schema.parameters
					]
				}

				if (!schema.responses)
					schema.responses = {
						200: {}
					}
			})

			newPaths[key] = value
		}

	return newPaths
}
