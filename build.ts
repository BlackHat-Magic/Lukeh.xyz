import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: [
        'website/static/ts/index.ts',
        'website/static/ts/master.ts',
        'website/static/ts/math.ts',
        'website/static/ts/post.ts',
        'website/static/ts/signup.ts',
    ],
    outdir: 'website/static/js',
    bundle: true,
    minify: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2022',
});

console.log('Build complete.');
