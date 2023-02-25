import { Elysia, t, SCHEMA } from 'elysia'
import swagger from '../src/index'

const app = new Elysia()
    .use(
        swagger({
            documentation: {
                info: {
                    title: 'Elysia',
                    version: '0.3.0'
                },
                tags: [
                    {
                        name: 'Test',
                        description: 'Hello'
                    }
                ]
            }
        })
    )
    .setModel({
        sign: t.Object(
            {
                username: t.String(),
                password: t.String()
            },
            {
                description: 'Models for handling authentication'
            }
        ),
        number: t.Number()
    })
    .get('/', ({ set }) => 'hi', {
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
                id: t.String({
                    description: 'Extract value from path parameter'
                })
            }),
            detail: {
                deprecated: true
            }
        }
    })
    .post('/json', ({ body }) => body, {
        schema: {
            contentType: 'application/json',
            body: 'sign',
            response: 'sign',
            detail: {
                summary: 'Using reference model'
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
            transform({ params }) {
                params.id = +params.id
            },
            schema: {
                body: 'sign',
                params: t.Object({
                    id: t.Number()
                }),
                response: {
                    200: t.Object(
                        {
                            id: t.Number(),
                            username: t.String(),
                            password: t.String()
                        },
                        {
                            title: 'User',
                            description: "Contains user's confidential metadata"
                        }
                    ),
                    400: t.Object({
                        error: t.String()
                    })
                },
                detail: {
                    summary: 'Transform path parameter'
                }
            }
        }
    )
    .post('/file', ({ body: { file } }) => file, {
        schema: {
            contentType: 'multipart/form-data',
            detail: {
                summary: 'Upload file demo',
                description:
                    'An example usage of using Elysia 0.3 to handle file upload'
            },
            body: t.Object({
                file: t.File()
            }),
            response: t.File()
        }
    })
    .post('/files', ({ body: { files } }) => files[0], {
        schema: {
            body: t.Object({
                files: t.Files({
                    type: 'image',
                    maxSize: '5m'
                })
            }),
            response: t.File()
        }
    })
    .listen(8080)
