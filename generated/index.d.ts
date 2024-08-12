import { Elysia } from 'elysia';
declare const app: Elysia<"", false, {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    type: {};
    error: {};
}, {
    schema: {};
    macro: {};
    macroFn: {};
}, {
    id: {
        ":id?": {
            get: {
                body: unknown;
                params: {
                    id?: string;
                };
                query: unknown;
                headers: unknown;
                response: {
                    200: "a";
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
export type app = typeof app;
export {};
