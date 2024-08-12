import type { OpenAPIV3 } from 'openapi-types';
export declare const SwaggerUIRender: (info: OpenAPIV3.InfoObject, version: string, theme: string | {
    light: string;
    dark: string;
}, stringifiedSwaggerOptions: string, autoDarkMode?: boolean) => string;
