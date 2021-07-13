import {
    compile,
    getCodeFromBundle,
    getCodeFromANodeUtils,
    getCompiler,
} from './helpers';

describe('parse sfc', () => {
    it('set aNode mode!', async () => {
        const testId = 'anode.san';
        const options = {
            compileTemplate: 'aNode',
        };
        const compiler = getCompiler(testId, options);
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromANodeUtils = await getCodeFromANodeUtils(testId, options);
        expect(codeFromBundle).toStrictEqual(codeFromANodeUtils);
    });

    it('set aPack mode!', async () => {
        const testId = 'anode.san';
        const options = {
            compileTemplate: 'aPack',
        };
        const compiler = getCompiler(testId, options);
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromANodeUtils = await getCodeFromANodeUtils(testId, options);

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

    it('with no options!', async () => {
        const testId = 'anode.san';
        const options = {
            compileTemplate: 'none',
        };
        const compiler = getCompiler(testId, options);
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromANodeUtils = await getCodeFromANodeUtils(testId, options);
        
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
