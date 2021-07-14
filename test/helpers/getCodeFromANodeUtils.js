import path from 'path';
import fs from 'fs';

import aNodeUtils from 'san-anode-utils';
import pug from 'pug';
import san from 'san';

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

    let data;
    let sanfile = await fs.promises.readFile(pathToFile);
    let parser;

    let tpl;

    if (options.testType === 'injs') {
        tpl = require(pathToFile).default.template;
        data = san.defineComponent({
            template: tpl,
        });
        parser = aNodeUtils.parseComponentTemplate;
    } else {
        // process the `template` and with `lang` attr
        data = sanfile
            .toString()
            .replace(/<template>/g, '')
            .replace(/<\/template>/g, '');

        if (options.lang === 'pug') {
            data = pug.render(data.replace(/<template lang="pug">/g, ''));
        }

        parser = aNodeUtils.parseTemplate;
    }

    const aNode = parser(data);
    switch (mergedOptions.compileTemplate) {
        case 'aNode':
            res = aNode;
            break;
        case 'aPack':
            if (aNode.children.length) {
                const aPack = aNodeUtils.pack(
                    options.testType === 'injs' ? aNode : aNode.children[0]
                );
                res = aPack;
            } else {
                res = [];
            }
            break;
        default:
            res = options.testType === 'injs' ? tpl : data;
            break;
    }

    return res;
}

export default getCodeFromANodeUtils;
