import { Elysia, t } from 'elysia'
import { swagger } from '../src/index'

const schema = t.Object({
	test: t.Literal('hello')
})

const app = new Elysia()
	.use(
		swagger({
			provider: 'scalar',
			documentation: {
				info: {
					title: 'Elysia Scalar',
					version: '0.8.1'
				},
				tags: [
					{
						name: 'Test',
						description: 'Hello'
					}
				],
				components: {
					schemas: {
						User: {
							description: 'string'
						}
					},
					securitySchemes: {
						JwtAuth: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'JWT',
							description: 'Enter JWT Bearer token **_only_**'
						}
					}
				}
			},
			swaggerOptions: {
				persistAuthorization: true
			}
		})
	)
	.model({ schema })
	.get(
		'/',
		() => {
			test: 'hello'
		},
		{
			response: t.Object({
				a: t.Ref('schema')
			})
		}
	)
	.listen(3000)
