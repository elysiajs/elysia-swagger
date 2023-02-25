import type { OpenAPIV3 } from 'openapi-types'

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
}
