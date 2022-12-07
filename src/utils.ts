export const formatSwagger = (path: string) => `window.onload = function() {
    window.ui = SwaggerUIBundle({
        url: "${path}/json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
        ],
        plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
    });
};`

export const filterPaths = (
    paths: Record<string, any>,
    {
        excludeStaticFile = true,
        exclude = []
    }: {
        excludeStaticFile: boolean
        exclude: (string | RegExp)[]
    }
) => {
    const newPaths: Record<string, any> = {}

    for (const [key, value] of Object.entries(paths))
        if (
            !exclude.some((x) => {
                if (typeof x === 'string') return key === x

                return x.test(key)
            }) &&
            !key.includes('/swagger') &&
            !key.includes('*') &&
            (excludeStaticFile ? !key.includes('.') : true)
        ) {
            Object.keys(value).forEach((method) => {
                const schema = value[method]

                if (key.includes('{')) {
                    if (!schema.parameters) schema.parameters = []

                    schema.parameters = [
                        ...key
                            .split('/')
                            .filter(
                                (x) =>
                                    x.startsWith('{') &&
                                    !schema.parameters.find(
                                        (params: Record<string, any>) =>
                                            params.in === 'path' &&
                                            params.name ===
                                                x.slice(1, x.length - 1)
                                    )
                            )
                            .map((x) => ({
                                in: 'path',
                                name: x.slice(1, x.length - 1),
                                type: 'string',
                                required: true
                            })),
                        ...schema.parameters
                    ]
                }

                if (!schema.responses)
                    schema.responses = {
                        200: {}
                    }
            })

            newPaths[key] = value
        }

    return newPaths
}
