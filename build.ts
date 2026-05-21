import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

const ctx = await esbuild.context({
    entryPoints: [
        'website/static/ts/index.ts',
        'website/static/ts/master.ts',
        'website/static/ts/math.ts',
        'website/static/ts/post.ts',
        'website/static/ts/signup.ts',
    ],
    outdir: 'public/js',
    bundle: true,
    minify: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2022',
});

if (watch) {
    await ctx.watch();
    console.log('Watching for changes...');
} else {
    await ctx.rebuild();
    await ctx.dispose();
    console.log('Build complete.');
}
