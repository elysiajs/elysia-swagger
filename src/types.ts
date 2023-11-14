import type { OpenAPIV3 } from 'openapi-types'
import type { SwaggerUIOptions } from 'swagger-ui'

export interface ElysiaSwaggerConfig<Path extends string = '/swagger'> {
    /**
     * Customize Swagger config, refers to Swagger 2.0 config
     *
     * @see https://swagger.io/specification/v2/
     */
    documentation?: Omit<
        Partial<OpenAPIV3.Document>,
        | 'x-express-openapi-additional-middleware'
        | 'x-express-openapi-validation-strict'
    >
    /**
     * Version to use for swagger cdn bundle
     *
     * @see unpkg.com/swagger-ui-dist
     *
     * @default 4.18.2
     */
    version?: string
    /**
     * Determine if Swagger should exclude static files.
     *
     * @default true
     */
    excludeStaticFile?: boolean
    /**
     * The endpoint to expose Swagger
     *
     * @default '/swagger'
     */
    path?: Path
    /**
     * Paths to exclude from Swagger endpoint
     *
     * @default []
     */
    exclude?: string | RegExp | (string | RegExp)[]
    /**
     * Options to send to SwaggerUIBundle
     * Currently, options that are defined as functions such as requestInterceptor
     * and onComplete are not supported.
     */
    swaggerOptions?: Omit<
        Partial<SwaggerUIOptions>,
        | 'dom_id'
        | 'dom_node'
        | 'spec'
        | 'url'
        | 'urls'
        | 'layout'
        | 'pluginsOptions'
        | 'plugins'
        | 'presets'
        | 'onComplete'
        | 'requestInterceptor'
        | 'responseInterceptor'
        | 'modelPropertyMacro'
        | 'parameterMacro'
    >
    /**
     * Custom Swagger CSS
     */
    theme?: string | {
        light: string
        dark: string
    }
    /**
     * Using poor man dark mode 😭
     */
    autoDarkMode?: boolean

    /**
     * Exclude OPTIONS method from Swagger
     */
    excludeOptions?: boolean
}
