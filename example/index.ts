import { Elysia, t } from 'elysia'
import swagger from '../src/index'

const app = new Elysia()
    .use(swagger())
    .setModel({
        sign: t.Object(
            {
                username: t.String(),
                password: t.String()
            },
            {
                title: 'Sign Model',
                description: 'Models for handling authentication'
            }
        ),
        number: t.Number()
    })
    .get('/', () => 'hi', {
        schema: {
            detail: {
                summary: 'Ping Pong',
                description: 'Lorem Ipsum Dolar',
                tags: ['Test']
            }
        }
    })
    .get('/unpath/:id', ({ params: { id } }) => id, {
        schema: {
            params: t.Object({
                id: t.String({ description: 'ID to get' })
            }),
            detail: {
                deprecated: true
            }
        }
    })
    .post(
        '/json/:id',
        ({ body, params: { id }, query: { name } }) => ({
            ...body,
            id
        }),
        {
            schema: {
                body: 'sign',
                response: {
                    200: t.Object(
                        {
                            username: t.String({
                                title: 'A'
                            }),
                            password: t.String(),
                            id: t.String()
                        },
                        {
                            description: 'A',
                            title: 'A'
                        }
                    ),
                    400: t.Object({
                        error: t.String()
                    })
                },
                detail: {
                    summary: 'A'
                }
            }
        }
    )
    .get('/unpath/:id/:name', ({ params: { id } }) => id)
    .post('/json', ({ body }) => body, {
        schema: {
            body: 'sign',
            response: 'sign'
        }
    })
    .listen(8080)
