import { Elysia } from 'elysia'
import { swagger } from '../src/index'
import { plugin } from './plugin'

const app = new Elysia({
    // aot: false
})
    .use(
        swagger({
            documentation: {
                info: {
                    title: 'Elysia Swagger',
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
    .use(plugin)
    .listen(3000)
