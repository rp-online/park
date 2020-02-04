function extend(core) {
  const Twig = core;
  const flushToken = {
    type: Twig.logic.type.use,
    regex: /^flush$/,
    next: [],
    open: true,
    compile(token) {
      delete token.match;
      return token;
    },
    parse(token, context, chain) {
      return {
        chain,
        output: '',
      };
    },
  };
  Twig.logic.extend(flushToken);
}

module.exports = extend;
