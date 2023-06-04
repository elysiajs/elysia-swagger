if ('Bun' in globalThis) {
  throw new Error('❌ Use Node.js to run this test!');
}

const { swagger } = require('@elysiajs/swagger');

if (typeof swagger !== 'function') {
  throw new Error('❌ CommonJS Node.js failed');
}

console.log('✅ CommonJS Node.js works!');
