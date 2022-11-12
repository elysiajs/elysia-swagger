import { KingWorld, t } from 'kingworld'

import swagger from '../src/index'

const app = new KingWorld()
    .use(swagger, {
        // path: '/v2/swagger',
        // swagger: {
        //     info: {
        //         title: 'Hello World',
        //         version: '0.0.0'
        //     }
        // }
    })
    .get('/', () => 'hi')
    .get('/unpath/:id', ({ params: { id } }) => id)
    .get('/unpath/:id/:name', ({ params: { id } }) => id)
    .post(
        '/json/:id',
        ({ body, params: { id }, query: { name } }) => ({
            ...body,
            id,
            name
        }),
        {
            schema: {
                params: t.Object({
                    id: t.String()
                }),
                query: t.Object({
                    name: t.String()
                }),
                body: t.Object({
                    username: t.String(),
                    password: t.String()
                }),
                response: t.Object({
                    username: t.String(),
                    password: t.String(),
                    id: t.String(),
                    name: t.String()
                })
            }
        }
    )
    .post('/json', ({ body }) => body, {
        schema: {
            body: t.Object({
                username: t.String(),
                password: t.String()
            }),
            response: t.Object({
                username: t.String(),
                password: t.String()
            })
        }
    })
    .listen(8080)
