/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { HTTPMethod, LocalHook } from 'elysia';

import { Kind, type TSchema, type TAnySchema } from '@sinclair/typebox';
import type { OpenAPIV3 } from 'openapi-types';

import deepClone from 'lodash.clonedeep';

export const toOpenAPIPath = (path: string) =>
    path
        .split('/')
        .map((x) => (x.startsWith(':') ? `{${x.slice(1, x.length)}}` : x))
        .join('/');

export const mapProperties = (
    name: string,
    schema: TSchema | string | undefined,
    models: Record<string, TSchema>,
) => {
    if (schema === undefined) return [];

    if (typeof schema === 'string')
        if (schema in models) schema = models[schema];
        else throw new Error(`Can't find model ${schema}`);

    return Object.entries(schema?.properties ?? []).map(([key, value]) => {
        const { type: valueType = undefined, ...rest } = value as any;
        return {
            // @ts-ignore
            ...rest,
            schema: { type: valueType },
            in: name,
            name: key,
            // @ts-ignore
            required: schema!.required?.includes(key) ?? false,
        };
    });
};

const mapTypesResponse = (types: string[], schema: TAnySchema) => {
    const responses: Record<string, OpenAPIV3.MediaTypeObject> = {};

    for (const type of types)
        responses[type] = {
            schema:
                typeof schema === 'string'
                    ? {
                          $ref: `#/components/schemas/${schema}`,
                      }
                    : { ...(schema as any) },
        };

    return responses;
};

export const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

export const generateOperationId = (method: string, paths: string) => {
    let operationId = method.toLowerCase();

    if (paths === '/') return operationId + 'Index';

    for (const path of paths.split('/')) {
        if (path.charCodeAt(0) === 123) {
            operationId += 'By' + capitalize(path.slice(1, -1));
        } else {
            operationId += capitalize(path);
        }
    }

    return operationId;
};

export const registerSchemaPath = ({
    schema,
    path,
    method,
    hook,
    models,
}: {
    schema: Partial<OpenAPIV3.PathsObject>;
    contentType?: string | string[];
    path: string;
    method: HTTPMethod;
    hook?: LocalHook<any, any>;
    models: Record<string, TSchema>;
}) => {
    if (hook) hook = deepClone(hook);

    const contentType = hook?.type ?? [
        'application/json',
        'multipart/form-data',
        'text/plain',
    ];

    path = toOpenAPIPath(path);

    const contentTypes =
        typeof contentType === 'string'
            ? [contentType]
            : contentType ?? ['application/json'];

    const bodySchema = hook?.body;
    const paramsSchema = hook?.params;
    const headerSchema = hook?.headers;
    const querySchema = hook?.query;
    const responseSchema: OpenAPIV3.ResponsesObject = {};

    const addToResponseSchema = (
        code: string,
        { description, ...schema }: TAnySchema,
    ) => {
        responseSchema[code] = {
            description: description as string,
            content: mapTypesResponse(contentTypes, schema),
        };
    };

    const userProvidedResponseSchema = hook?.response;
    if (typeof userProvidedResponseSchema === 'object') {
        if (Kind in userProvidedResponseSchema) {
            addToResponseSchema('200', userProvidedResponseSchema);
        } else {
            Object.entries(
                userProvidedResponseSchema as Record<string, TSchema>,
            ).forEach(([key, value]) => {
                addToResponseSchema(
                    key,
                    typeof value === 'string' ? models[value] : value,
                );
            });
        }
    } else if (typeof userProvidedResponseSchema === 'string') {
        addToResponseSchema('200', models[userProvidedResponseSchema]);
    }

    const parameters = [
        ...mapProperties('header', headerSchema, models),
        ...mapProperties('path', paramsSchema, models),
        ...mapProperties('query', querySchema, models),
    ];

    schema[path] = {
        ...(schema[path] ? schema[path] : {}),
        [method.toLowerCase()]: {
            ...((headerSchema || paramsSchema || querySchema || bodySchema
                ? ({ parameters } as any)
                : {}) satisfies OpenAPIV3.ParameterObject),
            ...(responseSchema
                ? {
                      responses: responseSchema,
                  }
                : {}),
            operationId:
                hook?.detail?.operationId ?? generateOperationId(method, path),
            ...hook?.detail,
            ...(bodySchema
                ? {
                      requestBody: {
                          content: mapTypesResponse(
                              contentTypes,
                              typeof bodySchema === 'string'
                                  ? {
                                        $ref: `#/components/schemas/${bodySchema}`,
                                    }
                                  : (bodySchema as any),
                          ),
                      },
                  }
                : null),
        } satisfies OpenAPIV3.OperationObject,
    };
};

export const filterPaths = (
    paths: Record<string, any>,
    {
        excludeStaticFile = true,
        exclude = [],
    }: {
        excludeStaticFile: boolean;
        exclude: (string | RegExp)[];
    },
) => {
    const newPaths: Record<string, any> = {};

    for (const [key, value] of Object.entries(paths))
        if (
            !exclude.some((x) => {
                if (typeof x === 'string') return key === x;

                return x.test(key);
            }) &&
            !key.includes('/swagger') &&
            !key.includes('*') &&
            (excludeStaticFile ? !key.includes('.') : true)
        ) {
            Object.keys(value).forEach((method) => {
                const schema = value[method];

                if (key.includes('{')) {
                    if (!schema.parameters) schema.parameters = [];

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
                                                x.slice(1, x.length - 1),
                                    ),
                            )
                            .map((x) => ({
                                schema: { type: 'string' },
                                in: 'path',
                                name: x.slice(1, x.length - 1),
                                required: true,
                            })),
                        ...schema.parameters,
                    ];
                }

                if (!schema.responses)
                    schema.responses = {
                        200: {},
                    };
            });

            newPaths[key] = value;
        }

    return newPaths;
};
