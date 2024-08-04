export type SpecConfiguration = {
    /** URL to a Swagger/OpenAPI file */
    url?: string;
    /** Swagger/Open API spec */
    content?: string | Record<string, any> | (() => Record<string, any>);
    /** The result of @scalar/swagger-parser */
    preparsedContent?: Record<any, any>;
};

export type ReferenceLayoutType = 'modern' | 'classic';

export type ThemeId = 'alternate' | 'default' | 'moon' | 'purple' | 'solarized' | 'none';
