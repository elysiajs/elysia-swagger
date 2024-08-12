import type { HTTPMethod, LocalHook } from 'elysia';
import { type TSchema } from '@sinclair/typebox';
import type { OpenAPIV3 } from 'openapi-types';
export declare const toOpenAPIPath: (path: string) => string;
export declare const mapProperties: (name: string, schema: TSchema | string | undefined, models: Record<string, TSchema>) => {
    description: any;
    examples: any;
    schema: any;
    in: string;
    name: string;
    required: any;
}[];
export declare const capitalize: (word: string) => string;
export declare const generateOperationId: (method: string, paths: string) => string;
export declare const registerSchemaPath: ({ schema, path, method, hook, models }: {
    schema: Partial<OpenAPIV3.PathsObject>;
    contentType?: string | string[];
    path: string;
    method: HTTPMethod;
    hook?: LocalHook<any, any, any, any, any, any, any>;
    models: Record<string, TSchema>;
}) => void;
export declare const filterPaths: (paths: Record<string, any>, docsPath: string, { excludeStaticFile, exclude }: {
    excludeStaticFile: boolean;
    exclude: (string | RegExp)[];
}) => Record<string, any>;
