import { OpenAPIV3 } from 'openapi-types';

type DateTimeSchema = {
    type: 'string';
    format: 'date-time';
    default?: string;
};

type SchemaObject = OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;

function isSchemaObject(schema: SchemaObject): schema is OpenAPIV3.SchemaObject {
    return 'type' in schema || 'properties' in schema || 'items' in schema;
}

function isDateTimeProperty(key: string, schema: OpenAPIV3.SchemaObject): boolean {
    return (key === 'createdAt' || key === 'updatedAt') &&
           'anyOf' in schema &&
           Array.isArray(schema.anyOf);
}

function transformDateProperties(schema: SchemaObject): SchemaObject {
    if (!isSchemaObject(schema) || typeof schema !== 'object' || schema === null) {
        return schema;
    }

    const newSchema: OpenAPIV3.SchemaObject = { ...schema };

    Object.entries(newSchema).forEach(([key, value]) => {
        if (isSchemaObject(value)) {
            if (isDateTimeProperty(key, value)) {
                const dateTimeFormat = value.anyOf?.find((item): item is OpenAPIV3.SchemaObject => 
                    isSchemaObject(item) && item.format === 'date-time'
                );
                if (dateTimeFormat) {
                    const dateTimeSchema: DateTimeSchema = {
                        type: 'string',
                        format: 'date-time',
                        default: dateTimeFormat.default
                    };
                    (newSchema as Record<string, SchemaObject>)[key] = dateTimeSchema;
                }
            } else {
                (newSchema as Record<string, SchemaObject>)[key] = transformDateProperties(value);
            }
        }
    });

    return newSchema;
}

export const SwaggerUIRender = (
    info: OpenAPIV3.InfoObject,
    version: string,
    theme:
        | string
        | {
              light: string
              dark: string
          },
    stringifiedSwaggerOptions: string,
    autoDarkMode?: boolean
): string => {
    const swaggerOptions: OpenAPIV3.Document = JSON.parse(stringifiedSwaggerOptions);

    if (swaggerOptions.components && swaggerOptions.components.schemas) {
        swaggerOptions.components.schemas = Object.fromEntries(
            Object.entries(swaggerOptions.components.schemas).map(([key, schema]) => [
                key,
                transformDateProperties(schema)
            ])
        );
    }

    const transformedStringifiedSwaggerOptions = JSON.stringify(swaggerOptions);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${info.title}</title>
    <meta
        name="description"
        content="${info.description}"
    />
    <meta
        name="og:description"
        content="${info.description}"
    />
    ${
        autoDarkMode && typeof theme === 'string'
            ? `
    <style>
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #222;
                color: #faf9a;
            }
            .swagger-ui {
                filter: invert(92%) hue-rotate(180deg);
            }

            .swagger-ui .microlight {
                filter: invert(100%) hue-rotate(180deg);
            }
        }
    </style>`
            : ''
    }
    ${
        typeof theme === 'string'
            ? `<link rel="stylesheet" href="${theme}" />`
            : `<link rel="stylesheet" media="(prefers-color-scheme: light)" href="${theme.light}" />
<link rel="stylesheet" media="(prefers-color-scheme: dark)" href="${theme.dark}" />`
    }
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@${version}/swagger-ui-bundle.js" crossorigin></script>
    <script>
        window.onload = () => {
            window.ui = SwaggerUIBundle(${transformedStringifiedSwaggerOptions});
        };
    </script>
</body>
</html>`;
};
