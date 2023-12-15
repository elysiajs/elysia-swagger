# 0.7.5 
Improvement:
- #[59](https://github.com/elysiajs/elysia-swagger/pull/59) use relative path to swagger json #59 

# 0.7.4 - 27 Oct 2023
Improvement:
- [#24](https://github.com/elysiajs/elysia-swagger/pull/24) - adding schema validity test

Change:
- [#48](https://github.com/elysiajs/elysia-swagger/pull/48) update Swagger UI to 4.9.0
- [#36](https://github.com/elysiajs/elysia-swagger/pull/36 ) point to generated .d.ts instead of raw .ts

Bug fix:
- [#41](https://github.com/elysiajs/elysia-swagger/pull/41) parameters mapping, fix
- [#43](https://github.com/elysiajs/elysia-swagger/pull/43) typo in default documentation

# 0.7.3 - 26 Sep 2023
Feature:
- [#19](https://github.com/elysiajs/elysia-swagger/pull/19) feat: handle nullish response types
- [#18](https://github.com/elysiajs/elysia-swagger/pull/18) swagger ui options 


Improvement:
- [#23](https://github.com/elysiajs/elysia-swagger/pull/23) Add github action to run bun test
- remove `removeComment` from tsconfig to show JSDoc
- add `theme` to customize Swagger CSS link
- add `autoDarkMode` using poor man Swagger dark mode CSS 😭

Change:
- Set default swagger version to 5.7.2

Bug fix:
- [#16](https://github.com/elysiajs/elysia-swagger/pull/16) fix: use global prefix

# 0.7.2 - 21 Sep 2023
Bug fix:
- Paths is undefined
- Models is not showing

# 0.7.1 - 20 Sep 2023
Bug fix:
- Add openapi-types as dependencies
- Fix `any` returned type

# 0.7.0 - 20 Sep 2023
- Add support for Elysia 0.

# 0.7.0-beta.0 - 18 Sep 2023
- Add support for Elysia 0.7

# 0.6.2 - 11 Sep 2023
- Ship lodash.cloneDeep type

# 0.6.1 - 17 Aug 2023
- Add support for user provided components

# 0.6.0 - 6 Aug 2023
- Add support for Elysia 0.6

# 0.6.0-rc.0 - 6 Aug 2023
- Add support for Elysia 0.6
# 0.5.0 - 15 May 2023
- Add support for Elysia 0.5
- Add CommonJS support

# 0.3.0 - 17 Mar 2023
Improvement:
- Add support for Elysia 0.3.0

# 0.3.0-rc.0 - 7 Mar 2023
Improvement:
- Add support for Elysia 0.3.0-rc.0

# 0.3.0-beta.0 - 25 Feb 2023
Improvement:
- Support Elysia >= 0.3.0-beta.0

Breaking Change:
- Update from OpenAPI 2.x to OpenAPI 3.0.3
- `swagger.swagger` is renamed to `swagger.documentation`

# 0.1.1 - 8 Jan 2023
Bug fix:
- Infers path type

# 0.1.0-rc.3 - 13 Dec 2022
Improvement:
- Add support for Elysia 0.1.0-rc.5

# 0.1.0-rc.2 - 9 Dec 2022
Improvement:
- Support for Elysia 0.1.0-rc.1 onward

Fix:
- Add main fields Bundlephobia

# 0.1.0-rc.1 - 6 Dec 2022
Improvement:
- Support for Elysia 0.1.0-rc.1 onward

# 0.0.0-experimental.3 - 29 Nov 2022
Change:
- Support for KingWorld 0.0.0-experimental.51

# 0.0.0-experimental.2 - 22 Nov 2022
Change:
- Support for KingWorld 0.0.0-experimental.51

# 0.0.0-experimental.1 - 12 Nov 2022
Improvement:
- Auto infers path params if schema is presented
- Auto infers path params now merge with schema.params
