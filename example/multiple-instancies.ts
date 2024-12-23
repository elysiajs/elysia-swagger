import { Elysia } from 'elysia'
import { swagger } from '../src/index'

const firstApp = new Elysia({ prefix: '/first' })

firstApp
	.get('/first-route', () => {
		return 'first route!'
	})
	.use(
		swagger({
			path: '/first-doc',
			routes: firstApp.routes
		})
	)

const secondApp = new Elysia({ prefix: '/second' })

secondApp
	.get('/second-route', () => {
		return 'second route!'
	})
	.use(
		swagger({
			path: '/second-doc',
			routes: secondApp.routes
		})
	)

const app = new Elysia({
	// aot: false
})
	.use(firstApp)
	.use(secondApp)
	.listen(3000)
