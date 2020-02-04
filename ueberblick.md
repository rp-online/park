# Überblick

Das Template System ist so aufgebaut, dass es komplett unabhängig von der eigentlichen PHP-basierten InterRed-Frontendschicht entwickelt und getestet werden kann. Folgerichtig liegt es in einem eigenen Repository und kann unabhängig von der PHP-basierten Frontendschicht weiterentwickelt und getestet werden. Und das bedeutet wiederum, dass es seine eigenen Release-Zyklen fahren kann, und es unabhängig von anderen Schichten auf Versionsnummern, Branches oder Commits festgenagelt, geupdated oder zurückgerollt werden kann.

In die PHP-basierte Frontendschicht werden die Templates derzeit hinein ausgecheckt und anschließend neu gebaut. Denkbar sind aber auch eine Nutzung als Subrepository oder als Composer-Paket.

### Nur Sourcen im Repo

Wie bei allen modernen Frontend-Entwicklungsworksflows liegen im Repo ausschließlich kleinteilige, unminifizierte Quelldateien, und Testcases/-daten vor. Aus diesen Quelldateien bauen ein Task-Runner und ein Package-Bundler Distributionsdateien, bei JavaScript etwa zwei transpilierte, concatenierte und minifizierte JavaScript-Dateien oder bei CSS zwei automatisch geprefixte, concatenierte und minifizierte Stylesheets. Zu Taskrunner & Co später mehr.

### Verwendete Dateiformate

Unsere Quelldateien nutzen dabei folgende Dateiformate, Markup- bzw. Programmiersprachen:

* Twig für die Templatelogik und HTML5 als Ausgabeformat
* SASS als CSS-Metasprache
* JavaScript nach EcmaScript 2015
* SVG für Icons

Hinzu kommen noch Dateien, die unsere Testdaten darstellen. Diese bestehen aus JSON-Dateien und einer Handvoll Bilder im JPG-Format.

## Aus "web" und "mdot" wird eine gemeinsam genutzte responsive Seite

Im Unterschied zur bisherigen Onlinepräsenz teilt sich das neue Frontend nicht mehr in zwei unabhängige Projekte für Desktop und Mobile auf. Stattdessen haben wir einen responsiven Ansatz gewählt. Durch die Werbeformate bedingt, konzentrieren wir uns aber weiterhin auf eine Handvoll festdefinierter Breakpoints. Der Vorteil dieses Ansatzes ist dass man Features nicht doppelt entwickeln muss und es auch leichter wird, SEO, Facebook & Co korrekt einzustellen. Der Nachteil ist, dass der Entwicklungs- und Testaufwand für jedes Feature steigt.

Für Bereiche, in denen weiterhin getrennte Verfahren angewandt werden sollen, wie etwa beim Tracking oder der Werbung, stehen Konstrukte bereit, die ein Hin- und Herschalten leicht machen.

Ebenfalls wegen der Werbung gehen wir für Tablets einen Sonderweg und weisen sie an, so zu tun, als wenn ihr Bildschirm eine Breite von 1280 Pixeln aufweisen würde - unabhängig von ihrer wahren Auflösung.

### Zielsysteme

Da der Trend sich immer stärker in Richtung mobilen Konsums entwickelt, und Google mit Android den mobilen Markt dominiert, und weil Google auch im Desktop-Bereich im deutschen Markt dem Platzhirschen Firefox immer näher kommt, ist Google Chrome der Browser, auf den wir die bestmögliche Experience ausrichten. Darüberhinaus möchten wir Firefox, Safari, den Samsung-Browser und Edge optimal unterstützen. Wie es heutzutage aufgrund der schnellen Upgrade-Zyklen üblich ist, würden wir hier jeweils die zwei aktuellsten Versionen ins Auge fassen.

Immer noch ein gutes Surferlebnis, aber vielleicht kein perfektes, wollen wir Nutzern von Internet Explorer 11 und 10, sowie dem neuesten Firefox ESR ermöglichen.

Und Besucher mit Internet Explorer 9 und dem Android-Browser sollen die Inhalte zumindest konsumieren können, aber ggf. mit starker Reduktion des Beiwerks. Dasselbe gilt für Chrome 41, weil dieser dem aktuellen JavaScript-fähigen Google-Crawler zugrunde liegt.

## Komponentenbasierte Architektur

Die Architektur verfolgt einen Komponenten-basierten Ansatz. Dieser Ansatz verringert die Abhängigkeiten zwischen verschiedenen Bereichen ein- und derselben Seite. Komponenten können im Idealfall an vielen Stellen recycelt werden. Und schlussendlich können neue Anforderungen an Seitenlayout durch Rekombination existierender Bausteine schneller bedient werden. Ein weiterer Vorteil, der sich daraus ergibt, ist der eines DRY-Prinzips, nämlich dass weniger Code-Dubletten entstehen, weil eine bestimmte Funktionalität immer in derselben Komponente mündet. Natürlich erfordert ein konsequentes Durchziehen dieses Ansatzes auch das entsprechende Vetständnis und die Mitwirkung der Produktentwicklung und der UI-Designabteilung.

### CSS: BEM, SASS, moderne Layouts

Passend zum Komponenten-basierten Ansatz ist das CSS nach BEM-Methodik umgesetzt. Bis auf Ausnahmen sind das folgende Eckpfeiler:

* Wir folgen einer strikten Benennungskonvention für CSS-Klassen
* Es werden immer nur CSS-Klassen zum Stylen verwendet
* Wir vermeiden tiefe CSS-Selektor-Ketten und damit "Spezifitätskriege"
* Jede Komponente lässt sich an jeder beliebigen Stelle im DOM einhängen, ohne Funktionsfehler zu erleiden
* Keine Komponente gibt eine eigene Breite vor. Stattdessen ergebit die sich aus dem vom Elternelement zur Verfügung gestellten Platz
* Wir nutzen für Varianten einer Komponente States

Die Fähigkeiten SASSs nutzen wir...

* indem wir Schriften, Schriftschnitte, sowie bestimmte Farben, Media Queries und Layout-Metriken in Variablen verlegen
* indem wir sich ähnelnde Anweisungen in Mixins oder Extends gruppieren
* indem wir uns durch SASS(!)-Verschachtelung Arbeit beim Schreiben langer BEM-Klassen abnehmen lassen
* indem wir die Aufgabe des Skinnings für verschiedene OEs darauf abbilden
* indem wir mit Hilfe des Kaufmanns-Und Sonderstile für deaktiviertes JavaScript angeben

Neben den Styles, die es individuell pro Komponente gibt, gibt es vorgelagert noch ein globale Styleangaben, vergleichbar einem CS-Reset. Das spart Wiederholungen in den Komponentenstyles und sorgt auch für eine bessere Stringenz.

Weil alle vorangig bedienten Ziel-Browser sie unterstützen, setzen wir moderne Layout-Techniken wie etwa CSS Flexbox und CSS Grid ein. Letzters eher punktuell. Beide Techniken werden in einer älteren Fassung auch von den Internet Explorern 10 und 11 unterstützt.

Außerdem achten wir darauf, dass alle Komponenten auch bei deaktiviertem JavaScript ein sinnvolles Aussehen annehmen.

### Modernes JavaScript, auch für ältere Browser

Wie es heutzutage eigentlich üblich ist, schreiben wir unser JavaScript in EcmaScript 2015 (ES2015) Syntax. Die Wesentlichen Vorteile darin, dass man durch die verkürzte Funktions-Deklaration Tipparbeit spart und dass man durch let und const besseren IDE-Support erhält. Klassen nutzen wir nicht oder kaum. Mit Hilfe unseres Task-Runner erzeugen wir aus unseren Quelldateien concatenierte und minifizierte Dateien in ES2015- und ES5-Syntax. Neuere ES2015-fähige Browser bekommen via Feature-Detection die kompakteren ES2015-Dateien ausgespielt, ältere Browser sehen nur die Dateien im älteren ES5-Format.

Darüberhinaus nutzen wir hier und da ein paar neuere Browser-, DOM-, Objekt- oder Array-APIs. Diese polyfillen wir für ältere Browser. Erscheint uns ein Polyfill zu groß, dann wählen wir entweder einen weniger elaborierten Alternativweg für nicht unterstützende Browser, oder wir verzichten auf die Nutzung der API.

"Groß" ist hier ein gutes Stichwort, denn eine Maxime beim Design des Frontends war, die Menge JavaScript so gering wie möglich zu halten. Hintergrund ist, dass wir zwar alle JavaScript und seine Möglichkeiten sehr schätzen, es aber die initiale Ladezeit und auch Interaktionsbereitschaft einer Seite stark verzögert. Das liegt vor allem an Parse- und Ausführungszeiten, die auf Midrange-Android-Telefonen spürbar Zeit in Anspruch nehmen können. Würden wir eine Single Page Application entwickeln, wo das JavaScript nur einmal zu Beginn initialisiert würde, könnte man mehr Kompromisse eingehen, aber unser Produkt verarbeitet ein- und dasselbe JavaScript bei jedem Seitenabruf ja ständig aufs Neue.

Weil moderne Browser in der Zwischenzeit so viel weiter gereift sind, nutzen wir weder jQuery, noch irgendwelche jQuery-Plugins für Interface-Elemente, und auch kein Lodash. Das macht unser JavaScript schlank und ermöglicht uns ein indivuelleres Zuschneiden auf unsere Anforderungen.

Ähnliche wie es auf der jetzigen Präsenz der Fall ist, kapseln und exponieren wir verschiedene selnstgeschriebene APIs auf dem Objekt `window.park`. Untereinander kommunizieren tun Komponenten, wenn überhaupt erforderlich, via Custom Events. 

### Ein Templatesystem, das auch clientseitig genutzt werden kann

Über das Rendering von Seiten und Komponenten im PHP-Kontext hinaus ergab sich auch die Anforderung, Komponenten clientseitig rendern zu können. Im Prinzip umfasste das all die Teile der Seite, die: 

* je Benutzer individuell gerendert werden sollten
* die Daten von externer Quelle darstellen sollten
* oder von denen wir uns eine bessere UX versprochen haben, wenn nach Interaktion nicht immer ein Seitenreload stattfinden muss

Deswegen haben wir eine Art Mini-React entwickelt, das statt mit JSX-Templates mit unseren Twig-Templates arbeitet und das ansonsten ähnliche Charakteristika aufweist.

In letzter Konsequenz könnte man es sogar dazu nutzen, eine komplette Single-Page-Applikation zu entwickeln, ohne dass irgendetwas auf einem Server gerendert werden müsste.

### Semantisches und barrierearmes HTML

Unser HTML folgt den neusten Standards, also HTML5.2 in SGML-Serialierung. Die Inhalte zeichnen wir möglichst sinnvoll mit Listen, Sektione, Artikeln, Headern, Footern und Asides aus. Darüberhinaus verwenden wir WAI-ARIA-Notationen, um Bezüge der Elemente zueinander herzustellen, und um Statii abzubilden - z.B. Auf- und Zuklappen via aria-controls und aria-expanded, oder Ein- und Ausblenden von Elementen via aria-hidden.

Da manche Komponenten auch mit Überschriften versehen werden können, es aber vollkommen unklar ist, wie tief diese Komponenten später in andere Komponenten hineinverschatelt werden, legen diese keine Überschriftenlevels fest, sondern lassen sich je nach Situation passend konfigurieren.

## Ladeperformance

Um eine möglichst schnelle Ladezeit zu erreichen, splitten wir sowohl die Stylesheets als auch das JavaScript in einen Teil, der direkt zu Beginn des Seitenladens benötigt wird, und in einen Teil, der asynchron nachgeladen wird.

Während direkt schon feststeht, welches JavaScript wir zu Beginn benötigen, lassen wir das kritische CSS mit Hilfe eines Headless-Browsers extrahieren. Im Prinzip wird hier für jeden Seitentyp der Präsenz das CSS extrahiert, das im oberen Browser-Ausschnitt zu sehen ist.

Diese beiden kritischen Ressourcen werden anschließend im Kopfbereich der Seiten-Template inline eingebunden, was HTTP-Requests spart.

Damit Schriften nicht blockieren, werden diese auch asynchron eingebunden und die Schriftart erst zur Verwendung freigegeben wenn sie geladen wurde.

Ansonsten nutzen wir Preloading per Meta-Angaben und befolgen die gängigen Performance-Bestpractices.