// import { TypeScriptToModel, ModelToJsonSchema } from '@sinclair/typebox-codegen'
// import { cwd } from 'process'
// import { join } from 'path'

// // await Bun.$` tsc example/index.ts --declaration --emitDeclarationOnly --esModuleInterop --skipLibCheck --declarationDir generated --rootDir example`

// // Bun.file(join(cwd(), 'generated/index.d.ts'))

// const type = TypeScriptToModel.Generate(`
// 	type A = {
// 		body: unknown;
//         params: {
//             id?: string;
//         };
//         query: unknown;
//         headers: unknown;
//         response: {
//             200: "a";
//         };
//     }
// `)

// console.dir(type, { depth: null })
