import path from 'path';
import fs from 'fs';

import aNodeUtils from 'san-anode-utils';

async function getCodeFromANodeUtils(testId, options = {}) {
    const pathToFile = path.resolve(__dirname, '..', 'fixtures', testId);

    const defaultOptions = {
        compileTemplate: '',
        compact: '',
    };
    const aNodeOptions = options || {};

    const mergedOptions = {
        ...defaultOptions,
        ...aNodeOptions,
    };

    let res = [];

    let data = await fs.promises.readFile(pathToFile);

    // process the `template`
    let originCode = data.toString().replace(/<template>/g, '').replace(/<\/template>/g, '')

    const aNode = aNodeUtils.parseTemplate(originCode);
    switch (mergedOptions.compileTemplate) {
        case 'aNode':
            res = aNode;
            break;
        case 'aPack':
            if (aNode.children.length) {
                const aPack = aNodeUtils.pack(aNode.children[0]);
                res = aPack;
            } else {
                res = [];
            }
            break;
        default:
            res = originCode;
            break;
    }

    return res;
}

export default getCodeFromANodeUtils;
