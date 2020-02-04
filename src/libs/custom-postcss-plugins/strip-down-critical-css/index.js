const postcss = require('postcss');

// Only strings, no RegExes here:
const unwantedAtRules = [
  '@media screen and (max-width: 48em) and (min-width: 48.0625em)',
];

// Strings or RegExes:
const unwantedSelectors = [
  /(?<=\*):before/,
  /(?<=\*):after/,
  /:focus$/,
  /:hover$/,
  /:nth-last-child/,
  /\[style\*=/,
  /^\.with-offers/,
  /^\.is-development/,
  /^\.js-disabled/,
  /^\.park-embeddable-component/,
];

// Strings or RegExes:
const unwantedProperties = [
  'background-image',
  'background-size',
  'background-position',
  'background-repeat',
  'box-shadow',
  'pointer-events',
  'cursor',
  'backface-visibility',
  'clip-path',
  'will-change',
  'user-select',
  /^scroll-snap/,
  /^counter/,
  /^-(webkit|moz|ms|khtml|o)/,
];

// Only strings, no RegExes here:
// Disabled as this blows up the string
const mergeProperties = [
  // 'display',
];

module.exports = postcss.plugin('strip-down-critical-css-plugin', () => function (root) {
  // Remove unwanted @-rules
  unwantedAtRules.forEach((atRule) => {
    root.walkAtRules((rule) => {
      if (`@${rule.name} ${rule.params}`.trim() === atRule) {
        rule.remove();
      }
    });
  });

  // Remove unwanted selectors
  unwantedSelectors.forEach((selector) => {
    root.walkRules(selector, (rule) => {
      rule.remove();
    });
  });

  // Remove unwanted properties
  root.walkRules((rule) => {
    unwantedProperties.forEach((property) => {
      rule.walkDecls(property, (decl) => {
        decl.remove();
      });
    });
  });

  // Remove duplicate properties
  root.walkRules((rule) => {
    const encounteredProperties = {};
    const duplicateDeclarations = [];

    rule.walkDecls((decl) => {
      const property = decl.prop;

      if (encounteredProperties[property]) {
        duplicateDeclarations.push(encounteredProperties[property]);
      }

      encounteredProperties[property] = decl;
    });

    duplicateDeclarations.forEach(decl => decl.remove());
  });

  // Merge properties
  mergeProperties.forEach((property) => {
    const values = {};

    root.walkRules((rule) => {
      rule.walkDecls(property, (decl) => {
        if (!values[decl.value]) {
          values[decl.value] = [];
        }

        values[decl.value].push(rule.selector);
        decl.remove();
      });
    });

    Object.keys(values).forEach((value) => {
      const selector = values[value].join(',');

      console.log(selector);

      const rule = postcss.rule({ selector });

      rule.append({
        prop: property,
        value,
      });

      root.append(rule);
    });
  });
});
