import { Elysia, t, SCHEMA } from 'elysia'
import { swagger } from '../src/index'
import { plugin } from './plugin'

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
    .use(plugin)
    .listen(8080)
