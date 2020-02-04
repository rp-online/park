import snarkdown from 'snarkdown';

function unindent(string) {
  const regexp = /^\s+/;
  let match = string.match(regexp);
  if (match === null) {
    return string;
  }
  const lines = string.split(/\n/);
  let indentation = null;

  for (let i = 0, lines1 = lines; i < lines1.length; i++) {
    const line = lines1[i];
    if (line === '') {
      continue;
    }
    match = line.match(regexp);
    if (match === null) {
      return string;
    } else if (indentation === null || indentation.length > match[0].length) {
      indentation = match[0];
    }
  }
  return string.replace(new RegExp(`^${indentation}`), '').replace(new RegExp(`\n${indentation}`, 'g'), '\n');
}

function extend(core) {
  const Twig = core;
  const markdownToken = {
    type: 'markdown',
    regex: /^markdown(?:\s+(.+))?$/,
    next: ['endmarkdown'],
    open: true,
    compile(token) {
      const compiledToken = token;
      const match = token.match;
      delete token.match;
      compiledToken.stack = match[1] == null ? [] : Twig.expression.compile.apply(this, [{
        type: Twig.expression.type.expression,
        value: match[1],
      }]).stack;
      return compiledToken;
    },
    parse(token, context, chain) {
      let markdown = unindent(Twig.parse.apply(this, [token.output, context]));

      return {
        chain,
        // NOTE: The `marked(markdown)` result was wrapped in `Twig.Markup` to prevent autoescaping.
        // (Twig.js does not support the `autoescape false` expression.)
        output: markdown == null ? '' : Twig.Markup(snarkdown(markdown)),
      };
    },
  };
  const endmarkdownToken = {
    type: 'endmarkdown',
    regex: /^endmarkdown$/,
    next: [],
    open: false,
  };
  Twig.logic.extend(markdownToken);
  Twig.logic.extend(endmarkdownToken);
}

module.exports = extend;
// based on https://github.com/ianbytchek/twig-js-markdown/blob/master/source/ts/index.ts, commit: 936d8dc02ece31c4c51aaa28a0ba90afeb1d5853
// removed usage of `fs`
