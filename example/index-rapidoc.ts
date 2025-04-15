import { Elysia, t } from 'elysia'
import { swagger } from '../src/index'

new Elysia({precompile: true})
    .use(
        swagger({
            provider: 'rapidoc',
            documentation: {
                info: {
                    title: 'Elysia Rapidoc',
                    version: '1.0.0'
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
            rapidocConfig: {

            }
        })
    )
    .get('/ping', async () => {
            return { pong: 'ping' }
        },
        {
            response: {
                200: t.Object({
                    pong: t.String({ default: 'ping' })
                })
            }
        }
    )
    .onStart(() => {
        console.info(`🔥 http://localhost:3200/swagger`)
    })
    .listen(3200)

