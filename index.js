const {parse} = require('@babel/parser');

const parseTemplateInJS = require('./lib/template-in-js');
const parseSFC = require('./lib/single-file-component');

module.exports = function (source) {
    try {
        parse(source);
        return parseTemplateInJS(source);
    } catch (error) {
        return parseSFC(source);
    }
};
