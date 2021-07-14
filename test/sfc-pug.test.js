import {
    compile,
    getCodeFromBundle,
    getCodeFromANodeUtils,
    getCompiler,
} from './helpers';

describe('parse sfc with lang attribute', () => {
    it('aNode mode with pug', async () => {
        const testId = 'anode-pug.san';
        const options = {
            compileTemplate: 'aNode',
        };
        const compiler = getCompiler(testId, options);
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(
            stats,
            compiler,
            'main.bundle.js',
            options
        );
        const codeFromANodeUtils = await getCodeFromANodeUtils(testId, {
            ...options,
            lang: 'pug',
        });
        expect(codeFromBundle).toStrictEqual(codeFromANodeUtils);
    });

    it('aPack mode with pug', async () => {
        const testId = 'apack-pug.san';
        const options = {
            compileTemplate: 'aPack',
        };
        const compiler = getCompiler(testId, options);
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(
            stats,
            compiler,
            'main.bundle.js',
            options
        );
        const codeFromANodeUtils = await getCodeFromANodeUtils(testId, {
            ...options,
            lang: 'pug',
        });
        let eq = true;
        for (let index = 0; index < codeFromBundle.length; index++) {
            const item = codeFromBundle[index];
            if (item != codeFromANodeUtils[index]) {
                eq = false;
                break;
            }
        }
        expect(eq).toBe(true);
    });

    it('no options, use default', async () => {
        const testId = 'apack-pug.san';
        const options = {
            compileTemplate: 'none',
        };
        const compiler = getCompiler(testId, options);
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(
            stats,
            compiler,
            'main.bundle.js',
            options
        );
        const codeFromANodeUtils = await getCodeFromANodeUtils(testId, {
            ...options,
            lang: 'pug',
        });
        let eq = true;
        for (let index = 0; index < codeFromBundle.length; index++) {
            const item = codeFromBundle[index];
            if (item != codeFromANodeUtils[index]) {
                eq = false;
                break;
            }
        }
        expect(eq).toBe(true);
    });
});
