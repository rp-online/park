Die Opener-Komponente ist ein Hero-Visual, das ganz oben auf Index-Seiten ausgespielt wird. Es teasert den wichtigsten Artikel dieser Index-Seite an.

Das besondere an dem Opener ist, dass er sich farblich entsprechend dem Bildmotiv einrichtet. Dafür muss die dominierende Farbe aus dem Motiv extrahiert und der Komponente über die Eigenschaft `backgroundColor` übergeben werden. Das geht beispielsweise mittels [Color Thief](#http://lokeshdhakar.com/projects/color-thief/).

Außerdem erwartet die Komponente, dass der Luminanzwert der dominierenden Farbe über die Eigenschaft `backgroundLuma` übergeben wird (0 - 255). Übersteigt die Luminanz die Schwelle von 200, kehrt sich die Textfarbe von hell uaf dunkel um.

Ist die Globale `config.keys.imageEngine` gesetzt, und liegt damit eine Lizenz zur Nutzung der [Scientia Mobile Image Engine](https://www.scientiamobile.com/page/imageengine) vor, dann schickt die Image_komponente alle URLs durch den Optimierer und bindet zusätzlich ein sehr niedrig aufgelöstes Vorschaubild ein.

Ansonsten bekommt die Komponente die üblichen Werte für Teaser-Elemente übergeben, also `kicker`, `headline`, `label` (z.B. "Olypia"), `dateline` (z.B. "dpa", oder "Düsseldorf"), `intro`, sowie `authors` für die Autorenzeile.

Desweitern können dazugehörige oder verwandte Artikel darunter einzeilig über ein Array in der Eigenschaft `related` angeteasert werden. 