const { getOptions } = require("loader-utils");
const aNodeUtils = require("san-anode-utils");

module.exports = function (source) {
    // we don't process entir html file
    if (source && source.includes('<!DOCTYPE html>')) return source;

    if (this.cacheable) this.cacheable();

    let result = source;

    const options = getOptions(this);
    const { compileTemplate } = options;

    if (compileTemplate) {
        const aNode = aNodeUtils.parseTemplate(source);

        switch (compileTemplate) {
            case "aNode":
                result = aNode;
                break;
            case "aPack":
                if (aNode.children.length) {
                    const aPack = aNodeUtils.pack(aNode.children[0]);
                    result = aPack;
                }
                break;
            default:
                break;
        }
    }

    return result;
};
