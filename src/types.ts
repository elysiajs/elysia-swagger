import type { OpenAPIV3 } from 'openapi-types'
import type { ReferenceConfiguration } from './scalar/types'
import type { SwaggerUIOptions } from './swagger/types'

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
     * Choose your provider, Scalar or Swagger UI
     *
     * @default 'scalar'
     * @see https://github.com/scalar/scalar
     * @see https://github.com/swagger-api/swagger-ui
     */
    provider?: 'scalar' | 'swagger-ui'
    /**
     * Version to use for Scalar cdn bundle
     *
     * @default '1.12.5'
     * @see https://github.com/scalar/scalar
     */
    scalarVersion?: string
    /**
     * Scalar configuration to customize scalar
     *
     * @default '1.12.5'
     * @see https://github.com/scalar/scalar
     */
    scalarConfig?: ReferenceConfiguration
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
     * Exclude methods from Swagger
     */
    excludeMethods?: string[]
}
