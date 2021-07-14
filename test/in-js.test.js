import {
    compile,
    getCodeFromBundle,
    getCodeFromANodeUtils,
    getCompiler,
} from './helpers';

jest.setTimeout(20000);

describe('loader', () => {
    it('parse js and use aPack', async () => {
        const testId = 'normal-san.js';
        const options = {
            compileTemplate: 'aPack',
            mode: 'compact',
            testType: 'injs',
        };
        const compiler = getCompiler(testId, options);
        const stats = await compile(compiler);
        let codeFromBundle = getCodeFromBundle(
            stats,
            compiler,
            'main.bundle.js',
            options
        );
        let codeFromANodeUtils = await getCodeFromANodeUtils(testId, options);
        expect(codeFromBundle.replace(/\s/g, '')).toContain(JSON.stringify(codeFromANodeUtils));
    });
});
