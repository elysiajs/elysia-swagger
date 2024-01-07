import type { ReferenceConfiguration } from '@scalar/api-reference'
import scalarElysiaTheme from './scalar-elysia-theme'

export const ScalarRender = (version: string, config: ReferenceConfiguration) => `<!doctype html>
<html>
  <head>
    <title>API Reference</title>
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
      ${config.customCss ?? scalarElysiaTheme}
    </style>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="${config.spec?.url}"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@${version}/dist/browser/standalone.min.js"></script>
  </body>
</html>`