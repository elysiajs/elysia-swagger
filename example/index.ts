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
            detail: {
                deprecated: false
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
                response: t.Object({
                    username: t.String(),
                    password: t.String(),
                    id: t.String()
                })
            }
        }
    )
    .get('/unpath/:id/:name', ({ params: { id } }) => id)
    .post('/json', ({ body }) => '1', {
        schema: {
            body: 'sign',
            response: 'sign'
        }
    })
    .listen(8080)
