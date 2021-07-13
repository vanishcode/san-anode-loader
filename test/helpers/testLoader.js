function testLoader(content, sourceMap) {
  const result = { code: content };

  if (sourceMap) {
    result.map = sourceMap;
  }

  return `globalThis.aNodeLoaderExports = ${JSON.stringify(result)};
  export default ${JSON.stringify(result)}`;
}

module.exports = testLoader;
