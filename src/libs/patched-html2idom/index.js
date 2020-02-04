/**
 * The patched version uses new String() method to counter this bug:
 * https://github.com/google/incremental-dom/issues/239
 */

var Parser = require("htmlparser2").Parser;
var IncrementalDOM = require("incremental-dom");

var elementOpen = IncrementalDOM.elementOpen;
var elementClose = IncrementalDOM.elementClose;
var text = IncrementalDOM.text;
var patch = IncrementalDOM.patch;

/** Parser with callbacks that invoke Incremental DOM */
var parser = new Parser({
    onopentag: function (name, attrs) {
        var argsArray = [name, null, null];

        // convert attribs object into a flat array
        for (var attr in attrs) {
            switch (attr) {
                default:
                    argsArray.push(attr, attrs[attr]);
                    break;

                case 'value':
                    argsArray.push(attr, new String(attrs[attr]));
                    break;
            }
        }

        elementOpen.apply(null, argsArray);
    },
    ontext: text,
    onclosetag: elementClose
}, {decodeEntities: true});

/**
 * build IDOM for ast node
 * @private
 * @param {Object} node - An AST node to render
 */
function renderToIDom(html) {
    parser.write(html);
    parser.end();
};

/**
 * apply the HTML to an element via Incremental DOM's `patch`
 * @param {Element} el - The element to apply the patch to
 * @param {String} html - A string of HTML
 */
function patchHTML(el, html) {
    patch(el, function () {
        return renderToIDom(html);
    });
}

module.exports = {
    renderToIDom: renderToIDom,
    patchHTML: patchHTML
}