import { KingWorld, t } from 'kingworld'
// ? @kingworldjs/schema
import swagger from '../src/index'

const app = new KingWorld()
    .use(swagger)
    .get('/', () => 'hi')
    .get('/unpath/:id', ({ params: { id } }) => id)
    .post(
        '/json/:id',
        ({ body, params: { id }, query: { name } }) => ({
            ...body,
            id
        }),
        {
            schema: {
                body: t.Object({
                    username: t.String(),
                    password: t.String()
                }),
                response: t.Object({
                    username: t.String(),
                    password: t.String(),
                    id: t.String()
                })
            }
        }
    )
    .get('/unpath/:id/:name', ({ params: { id } }) => id)
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
