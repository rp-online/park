(function (document) {
    var findInlineScript = function findInlineScript(scripts, line) {
        var i = 0,
            source = document.documentElement.outerHTML,
            codeRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i'),
            code = source.replace(codeRegExp, '$1').trim();

        for (; i < scripts.length; i++) {
            if (scripts[i].innerHTML && scripts[i].innerHTML.trim() === code) {
                return scripts[i];
            }
        }

        return null;
    };
    var currentScript = 'currentScript';

    // If browser needs currentScript polyfill, add get currentScript() to the document object
    if (!(currentScript in document)) {
        Object.defineProperty(document, currentScript, {
            get: function () {
                // IE 8-10 support script readyState
                // IE 11+ support stack trace
                try {
                    throw new Error();
                }
                catch (err) {
                    // Find the second match for the "at" string to get file src url from stack.
                    // Specifically works with the format of stack traces in IE.
                    var i = 0,
                        stackDetails = (/.*at [^(]*\((.*):(.+):(.+)\)$/ig).exec(err.stack),
                        scriptLocation = (stackDetails || [false])[1],
                        line = (stackDetails || [false])[2],
                        currentLocation = document.location.href.replace(document.location.hash, ''),
                        scripts = document.getElementsByTagName('script'); // Live NodeList collection

                    for (; i < scripts.length; i++) {
                        if (scripts[i].readyState === 'interactive') {
                            return scripts[i];
                        }
                    }

                    if (scriptLocation === currentLocation) {
                        return findInlineScript(scripts, line);
                    }

                    // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
                    for (i = 0; i < scripts.length; i++) {
                        if (scripts[i].src === scriptLocation) {
                            return scripts[i];
                        }
                    }

                    // If no match, return null
                    return null;
                }
            }
        });
    }
})(document);
