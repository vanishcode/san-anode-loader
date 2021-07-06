const { parse } = require('@babel/parser');

const parseTemplateInJS = require('./lib/template-in-js');
const parseSFC = require('./lib/single-file-component');

module.exports = function (source) {
    try {
        parse(source, {
            sourceType: 'module',
            plugins: ['classProperties'],
        });
        return parseTemplateInJS.call(this, source);
    } catch (error) {
        return parseSFC.call(this, source);
    }
};
