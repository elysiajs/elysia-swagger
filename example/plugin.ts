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
    // .post(
    //     '/json/:id',
    //     ({ body, params: { id }, query: { name } }) => ({
    //         ...body,
    //         id
    //     }),
    //     {
    //         transform({ params }) {
    //             params.id = +params.id
    //         },
    //         schema: {
    //             body: 'sign',
    //             params: t.Object({
    //                 id: t.Number()
    //             }),
    //             response: {
    //                 200: t.Object(
    //                     {
    //                         id: t.Number(),
    //                         username: t.String(),
    //                         password: t.String()
    //                     },
    //                     {
    //                         title: 'User',
    //                         description:
    //                             "Contains user's confidential metadata"
    //                     }
    //                 ),
    //                 400: t.Object({
    //                     error: t.String()
    //                 })
    //             },
    //             detail: {
    //                 summary: 'Transform path parameter'
    //             }
    //         }
    //     }
    // )
    .post('/file', ({ body: { file } }) => file, {
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
