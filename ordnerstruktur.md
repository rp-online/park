Wie bei allen modernen Frontend-Entwicklungsworksflows liegen im Repo ausschließlich kleinteilige, unminifizierte Quelldateien, und Testcases/-daten vor. Diese liegen in `/src/`. Aus diesen Quelldateien bauen ein Task-Runner und ein Package-Bundler Distributionsdateien, die sie in einem neu erzeugten Ordner namens `/dist/` ablegen.

Hier geht es darum, was sich alles im Quellordner befindet, und was wie und wo im Zielordner  landet.

## Der Quellordner `/src/`

* __components__: Beinhaltet Templates, CSS, JavaScript sowie Testdaten aller Komponenten
* __critical__: Ist initial leer, dient später als Zwischenlager für extrahiertes kritisches CSS
* __fonts__: Schriftdateien in diversen Formaten (wir nutzen nur WOFF und WOFF2)
* __images__: Testbilder
* __js__: Alle globalen JavaScript-Helferlein
* __libs__: Drittanbieter-Bibliotheken, die wir modifizieren mussten
* __pages__: Strukturdaten für unsere statischen Testseiten (Clickdummies)
* __scripts__: Spezielle Task-Runner Scripte
* __scss__: Alle globalen SASS-Styles und -Helferlein
* __skins__: Schriftdefinitionen, Farbangaben, Icons, Logo & Co, die eine Skin/OE ausmachen
* __snippets__: Ständig benötigte Hilfsschnipsel für die Browser-Console
* __stats__: Zwischenlager für CSS-Statistiken, sofern man sie aktiviert
* __svg__: Quellordner für SVG-Dateien
* __twig__: Hier liegen die ganzen Basis-Layouts für die verschiedenen Seitentypen
* __widgets__: Hier liegen alle JavaScript-Dateien für unsere clientseitig gerenderten Widgets

## Der Zielordner `/dist/`

Direkt im Zielordner landen nach dem Durchlaufenlassen des Task-Runners folgende Dateien:

* Alle aus den Daten in `/src/pages/*` erzeugten statischen HTML-Testseiten
* Die `inventory.html`, die alle unsere Komponenten alphabetisch und in allen existierenden Varianten auflistet
* Unser Service Worker, der derzeit aber nicht viel tut, außer Schriften und das IVW-Script zu cachen.

Außerdem gibt es darin einen Unterordner namens `components/`. Darin landen unsere Komponente alle noch einmal, aber einzeln isoliert, jeweils als separate Datei.

Desweiteren gibt es noch den Ordner `assets/`. In diesem direkt landen alle erzeugten JavaScript-Dateien. Und dann gibt es auch hier wieder Unterordner für den gesamten Rest:

* __ajax__: Dummy-AJAX-JSON-Dateien, um die AJAX-Funktionalität von Komponenten testen zu können
* __fonts__: Alle Schriftdateien
* __images__: Alle Testbilder, aber auch alle erzeugten SVG-Sprites
* __skins__: In Unterordnern wie `rp-online`oder `ngz` liegen dort Stylesheets, Icons und Logos
* __widgets__: Hier landen unsere fertig kompilierten Widgets

## Der Root-Ordner `/`

Im Root-Ordner liegen im Wesentlichen nur Konfigurationsdateien:

* __.babelrc__: Einstellungen für den JavaScript-Transpiliervorgang
* __.editorconfig__: Stellt die zugrundeliegende IDE automatisch hinsichtlich Tabs und Spaces ein
* __.eslintignore__: ESLint (prüft unser JavaScript auf Fehler und Einhaltung der Code-Konventionen) 
* __.eslintrc__: ebenfalls ESLint
* __.gitattributes__: Git
* __.gitignore__: Git
* __.htaccess__: Konfiguration für einen ggf. lokal laufenden Apache
* __.idea__: Web-/PHPStorm Konfiguration
* __.stylelintrc__: (SASS) Stylelint (prüft unser CSS auf Fehler und Einhaltung der Code-Konventionen)
* __.travis.yml__: Wir nutzen Travis CI, um Pull-Requests zu prüfen und um den neuesten Stand der Templates auf https://templates:gera16@templates.park.works/ zu deployen. Und dies ist seine Konfigurationsdatei.

Außerdem liegen dort alle Infos zu den benötigten Paketen für unseren Paketmanager Yarn (`package.json`und `yarn.lock`).

Und zu guter letzt wird dort in dem `gulpfile.js` und der `webpack.config.js` auch konfiguriert, welche Arbeiten der Task-Runner und der Module-Bundler zu verrichten haben.