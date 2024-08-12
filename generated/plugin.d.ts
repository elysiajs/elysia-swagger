import { Elysia } from 'elysia';
export declare const plugin: Elysia<"/a", false, {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    type: {
        readonly sign: {
            username: string;
            password: string;
        };
        readonly number: number;
    };
    error: {};
}, {
    schema: {};
    macro: {};
    macroFn: {};
}, {
    a: {
        index: {
            get: {
                body: unknown;
                params: {};
                query: unknown;
                headers: unknown;
                response: {
                    200: string;
                };
            };
        };
    };
} & {
    a: {
        unpath: {
            ":id": {
                get: {
                    body: unknown;
                    params: {
                        id: string;
                    };
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: string;
                    };
                };
            };
        };
    };
} & {
    a: {
        json: {
            post: {
                body: unknown;
                params: {};
                query: unknown;
                headers: unknown;
                response: {
                    200: unknown;
                };
            };
        };
    };
} & {
    a: {
        json: {
            ":id": {
                post: {
                    body: unknown;
                    params: {
                        id: string;
                    };
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: unknown;
                        418: unknown;
                    };
                };
            };
        };
    };
} & {
    a: {
        file: {
            post: {
                body: unknown;
                params: {};
                query: unknown;
                headers: unknown;
                response: {
                    200: unknown;
                };
            };
        };
    };
}, {
    derive: {};
    resolve: {};
    schema: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
}>;
