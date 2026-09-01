import { build } from 'vite';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const output = resolve('public');
await rm(resolve(output, 'assets'), { recursive: true, force: true });
await rm(resolve(output, 'js'), { recursive: true, force: true });
await build();
console.log('Svelte build complete.');
