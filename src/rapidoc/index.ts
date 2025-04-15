import type { OpenAPIV3 } from "openapi-types";

/**
 * Rapidoc Config
 * @see https://rapidocweb.com/api.html
 */
export type RapidocConfig = Partial<{
    specUrl: string
    //
    allowAdvancedSearch: boolean
    allowSpecFileDownload: boolean
    allowTry: boolean
    defaultSchemaTab: 'schema'
    fillRequestFieldsWithExample: boolean
    gotoPath: string
    headingText: string
    infoDescriptionHeadingsInNavbar: boolean
    layout: 'row' | 'column'
    loadFonts: boolean
    monoFont: string
    navItemSpacing: 'default' | 'compact' | 'relaxed'
    onNavTagClick: 'expand-collapse' | 'show-description'
    persistAuth: boolean
    renderStyle: 'read' | 'view' | 'focused'
    responseAreaHeight: string
    schemaDescriptionExpanded: boolean
    schemaExpandLevel: number
    schemaStyle: 'table'
    showComponents: boolean
    showCurlBeforeTry: boolean
    showHeader: boolean
    showInfo: boolean
    showMethodInNavBar: 'as-colored-block'
    sortEndpointsBy: 'path' | 'method' | 'summary' | 'none'
    sortSchemas: boolean
    sortTags: boolean
    theme: 'light' | 'dark'
    usePathInNavBar: boolean
}>

function kebab(str: string): string {
    return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())
}

function renderConfig(config: RapidocConfig): string {
    const a: string[] = []
    Object.keys(config).forEach((key) => {
        a.push(`${kebab(key)}="${String(config[key as keyof RapidocConfig])}"`)
    })
    return a.join(' ')
}

export const RapidocRender = (
    info: OpenAPIV3.InfoObject,
    config: RapidocConfig,
    cdn = 'https://unpkg.com/rapidoc/dist/rapidoc-min.js'
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
    <script type="module" src="${cdn}" crossorigin></script>
  </head>
  <body>
    <rapi-doc ${renderConfig(config)}></rapi-doc>
  </body>
</html>
`
