const path = require('path');

const parseTemplateInJS = require('./lib/template-in-js');
const parseSFC = require('./lib/single-file-component');

module.exports = function (source) {
    if (!this.resourcePath.includes('node_modules')) {
        const extName = path.extname(this.resourcePath);

        if (
            extName === '.san' &&
            this.resourceQuery.includes('type=template')
        ) {
            return parseSFC.call(this, source);
        }

        if (extName === '.js') {
            return parseTemplateInJS.call(this, source);
        }
    }
    return source;
};
