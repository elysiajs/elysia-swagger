import { elysiajsTheme } from '@scalar/themes'
import type { OpenAPIV3 } from 'openapi-types'
import type { ApiReferenceConfigurationWithSources } from '@scalar/types/api-reference' with { "resolution-mode": "import" };

export const ScalarRender = (
    info: OpenAPIV3.InfoObject,
    version: string,
    config: Partial<ApiReferenceConfigurationWithSources>,
    cdn: string
) => `<!doctype html>
<html>
  <head>
    <title>${info.title}</title>
    <meta
        name="description"
        content="${info.description}"
    />
    <meta
        name="og:description"
        content="${info.description}"
    />
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
      }
    </style>
    <style>
      ${config.customCss ?? elysiajsTheme}
    </style>
  </head>
  <body>
    <div id="app"></div>

    <script src="${
        cdn
            ? cdn
            : `https://cdn.jsdelivr.net/npm/@scalar/api-reference@${version}/dist/browser/standalone.min.js`
    }" crossorigin></script>

    <script>
      Scalar.createApiReference('#app', ${JSON.stringify(config)})
    </script>
  </body>
</html>`
