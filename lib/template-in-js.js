/**
 * @file 处理js中的template
 * @author luoyi06
 * @link https://github.com/luoyimaid/san-template-loader/blob/master/lib/loader.js
 */

 const san = require('san');
 const loaderUtils = require('loader-utils');
 const aNodeUtils = require('san-anode-utils');
 const {parse} = require('@babel/parser');
 const traverse = require('@babel/traverse').default;
 const generate = require('@babel/generator').default;
 const t = require('@babel/types');
 
 module.exports = function (source) {
     const loaderOptions = loaderUtils.getOptions(this);
     // mode strict/compact 严格模式/兼容模式
     // 严格模式下不允许在template里写字符串表达式；兼容模式下可支持字符串表达式，默认严格模式，希望后续可遵循规范
     const {compileTemplate = '', mode = 'strict'} = loaderOptions;
 
     const options = {
         sourceType: 'module',
         plugins: [
             'classProperties'
         ]
     };
 
     // 获取资源文件的ast
     const ast = parse(source, options);
     const that = this;
 
     // eslint-disable-next-line no-shadow
     const handleCompileTemplate = ({templateType, aNode, path}) => {
         switch (templateType) {
             case 'aNode':
                 path.insertAfter(t.classProperty(
                     t.identifier('aNode'),
                     t.objectExpression(aNode),
                     null,
                     null,
                     false,
                     true
                 ));
                 break;
             case 'aPack':
                 if (aNode.children.length) {
                     const aPack = aNodeUtils.pack(aNode);
                     path.insertAfter(t.classProperty(
                         t.identifier('aPack'),
                         t.arrayExpression(
                             aPack.map(item => typeof item === 'number'
                                     ? t.numericLiteral(item)
                                     : (typeof item === 'string'
                                         ? t.stringLiteral(item)
                                         : t.nullLiteral()
                                     ))
                         ),
                         null,
                         null,
                         false,
                         true
                     ));
                 }
                 break;
             default:
                 break;
         }
     };
 
 
     // 修改ast，把template节点改为anode/apack节点，并赋值给新增变量
     // 小问题：html最外层元素不能用template标签，只能用div
     const visitor = {
         ClassProperty(path) {
             const key = path.node.key || {};
             const outValue = path.node.value || {};
 
             // 如果变量定义是 template 并且 值类型是 TemplateLiteral，则可以确定是定义为template的html片段
             if (compileTemplate && key.name === 'template' && outValue.type === 'TemplateLiteral') {
 
                 const isStringTemplate = Array.isArray(path.node.value.expressions)
                     && path.node.value.expressions && path.node.value.expressions.length;
 
                 const value = Array.isArray(path.node.value.quasis)
                     && path.node.value.quasis[0]
                     && path.node.value.quasis[0].value
                     ? path.node.value.quasis[0].value : {};
 
                 // mode默认严格模式，若option里面无mode参数，则只要代码里的template有表达式，那就会报错
                 // 如果必须要写字符串表达式，option里必须有mode参数，并且值为compact
                 // 严格模式下，并且有字符串表达式，直接抛出错误
                 if (mode === 'strict' && isStringTemplate) {
                     throw new Error(`${that.resourcePath}报错，template模板不支持字符串表达式`);
                 }
                 // 无论是严格模式还是兼容模式，只要无字符串表达式，template --> apack，其余情况不做处理
                 else if (!isStringTemplate) {
                     const Component = san.defineComponent({
                         template: `${value.raw || ''}`
                     });
                     const aNode = aNodeUtils.parseComponentTemplate(Component);
 
                     handleCompileTemplate({
                         compileTemplate,
                         aNode,
                         path
                     });
                     path.remove();
                 }
             }
         }
     };
     traverse(ast, visitor);
 
     const output = generate(ast, {
         compact: true,
         comments: false,
         jsonCompatibleStrings: true
     });
 
     return output.code;
 };
 