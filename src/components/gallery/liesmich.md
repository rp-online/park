Diese Komponente bildet den Körper für alle Bilder- und Infostrecken. Folgende Daten erwartet die Komponente:

* `id`: Die Beitrags-ID (benötigt für das Lesezeichensetzen)
* `timestamp`: Das erstelldatum des Beitrags als Zeitstempel in Sekunden
* `items`: Ein Array von anzuzeigenden Slides. Mehr zu deren Struktur weiter unten
* `lastItem`: Das letzte Slide der Strecke, das von der Struktur her den anderen Slides gleicht
* `ads`: Die Werbekonfiguration - auch hierzu mehr Infos weiter unten

### Slides Sturktur (items)

Jedes Slide besteht aus:

* `headline`: Individuelle Überschrift
* `figure`: Die in dem Slide darzustellende Komponente, zu konfigurieren via `component` und `data` Kombination. `component` bennent dabei die im Slide einzubettende Komponente, und `data` beschreibt die Daten, die in diese Komponente eingespeist werden sollen. Bei Bilderstrecken ist es die [Image](#image)-Komponente , bei Infostrecken ist es meist eines der Embeds oder die [HTML](#html)-Komponente.
* `caption`: Eine Bild- bzw. Embed-Beschreibung. Wird nur sie gesetzt, und `figure` leer gelassen, wird die `caption` prominent im Slide platziert (gedacht für Zitate-Infostrecken)
* `source`: Die Quellenangabe für das entsprechende Slide-Motiv

Bei dem letzten Slide wird als Komponente gerne die [Teaser-Tiles](#teaser-tiles)-Komponente verwendet, die auf weitere Strecken verweist. Alternativ kann auch sowas wie das [Outbrain](#outbrain)-Modul genutzt werden.

### Werbung (ads)

Es gibt zwei Typen von [Werbung](#portal), die in eine Bilder- oder Infostrecke hineinkonfiguriert werden kann:

* `caption`: Eine Content-Ad im Format 300 x 250 Pixel, die rechts unterhalb des Motivs eingebunden wird, und die den text der Bildunterschrift nach links drückt. Wird wenn, dann nur in Bilderstrecken verwendet. Derzeit allerdings nicht einmal dort.
* `slides`: Diese Werbung unterbricht die Bildfolge immer wieder, um eine Werbung darzustellen, und nach genau so viel Slides, wie in der `interval`-Eigenschaft angegeben ist.

Was es bei der Werbung mit den Eigenschaften `mobile` / `desktop`, sowie `type` und `html` auf sich hat, das wird in der [Portal](#portal)-Komponente beschrieben. 