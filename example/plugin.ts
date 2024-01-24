import { Elysia, t } from 'elysia'

export const plugin = new Elysia({
    prefix: '/a'
})
    .model({
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
        detail: {
            summary: 'Ping Pong',
            description: 'Lorem Ipsum Dolar',
            tags: ['Test']
        }
    })
    .get('/unpath/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.String({
                description: 'Extract value from path parameter'
            })
        }),
        detail: {
            deprecated: true
        }
    })
    .post('/json', ({ body }) => body, {
        type: 'json',
        body: 'sign',
        response: {
            200: 'sign'
        },
        detail: {
            summary: 'Using reference model'
        }
    })
    .post(
        '/json/:id',
        ({ body, params: { id }, query: { name } }) => ({
            ...body,
            id
        }),
        {
            body: 'sign',
            params: t.Object({
                id: t.Numeric()
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
                418: t.Array(
                    t.Object({
                        error: t.String()
                    })
                ),
            },
            detail: {
                summary: 'Complex JSON'
            }
        }
    )
    .post('/file', ({ body: { file } }) => file, {
        type: 'formdata',
        body: t.Object({
            file: t.File({
                type: ['image/jpeg', 'image/'],
                minSize: '1k',
                maxSize: '5m'
            })
        }),
        response: t.File()
    })
// .post('/files', ({ body: { files } }) => files[0], {
//     schema: {
//         body: t.Object({
//             files: t.Files({
//                 type: 'image',
//                 maxSize: '5m'
//             })
//         }),
//         response: t.File()
//     }
// })
