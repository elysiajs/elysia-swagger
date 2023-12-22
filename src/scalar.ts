import scalarElysiaTheme from './scalar-elysia-theme'

export const ScalarRender = (specUrl: string, version: string, customCss?: string) => `<!doctype html>
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
      ${customCss ?? scalarElysiaTheme}
    </style>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="${specUrl}"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@${version}/dist/browser/standalone.min.js"></script>
  </body>
</html>`