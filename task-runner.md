Als Task-Runner kommt Gulp zum Einsatz, ergänzt durch den Module-Bundler Webpack, der unser Twig-basiertes "React" zusammenbaut und die darauf aufbauenden clientseitigen Widgets.

Als Paketmanager zur Installation der verwendeten Gulp- und Webpack-Plugins nutzen wir Yarn.

Folgende relevanten Tasks sind in Gulp konfiguriert:

* __build__: Baut das gesamte Projekt mit allem Zipp und Zapp. Nachteil: Dauert sehr lange
* __fastbuild__: Baut das gesamte Projekt, überspringt aber die Extraktion des kritischen CSS und das Erzeugen der SVG-Sprites
* __criticalbuild__: Extraktion des kritischen CSS und das Erzeugen der SVG-Sprites
* __lint__: Prüft SASS, JavaScript und JSON-Dateien auf Syntax-Fehler und um die Einhaltung von Code-Conventions
* __css__: Kompliert das SASS nach CSS (einmal je Skin/OE), fügt dabei alle notwendigen Browser-Prefixe hinzu, gruppiert Media Queries, minifiziert das CSS, erzeugt Sourcemaps für die Transformation und komprimiert am Ende noch die resultierenden CSS-Dateien
* __js__: Transpiliert das ES2015-JavaScript nach ES5-JavaScript, minifiziert beides, erzeugt Sourcemaps für die ZTransformationen und komprimiert die resultierenden JavaScript-Dateien. Ausgenommen sind hier die Widgets.
* __skins__: Erzeugt oder kopiert über das CSS hinausgehende Skin/OE-Datei-Varianten: Icons, Manifest-Datei, Schrifteinbettungscode, Logo und browserconfig.xml.
* __widgets__: Kompiliert die Basisbibliothek für unsere Widgets und die Widgets selbst und bereitet die Twig-Templates für ein schnelles Laden im Browser auf.
* __svg__: Optimiert die SVGs an Ort und Stelle (ohne sie woanders hin zu kopieren)
* __compress:svg-sprites__: Erzeugt einige SVG-Sprites und komprimiert sie am Ende
* __templates___*: Erzeugt Click-Dummy-Seiten, anhand derer unter `/dist/` getestet werden kann, das Komponenteninventar unter `/dist/inventory.html` sowie alle Komponenten und ihre Varianten unter `/dist/components/[Komponenten-Ordner]-[Variante].html`.