Diese Komponente bettet eine [IFrame](#iframe)-Komponente in einem entsprechenden Rahmen ein. Zum Einsatz kommt sie entweder im Artikel-Körper ([article](#article)) oder aber in der [gallery](#gallery) (was die Galerie zur Infostrecke macht).

Wie die IFrame-Komponente ist sie in der Breite responsiv. Soll sie nicht nur in der Breite responsiv sein, sondern sie Ihre Höhe immer einem bestimmten Seitenverhältnis anpassen, so muss das gewünschte Seitenverhältnis über die Werte `width` und `height` definiert und die boolsche Eigenschaft `keepAspectratio` auf `true` gesetzt werden.

Zur automatischen Justierung der IFrame-Höhe, passend zum Inhalt des IFrames, kann in der Zielseite [ein Script eingebunden werden](https://templates.park.works/iframe.html), das die Höhe kontinuierlich misst und an das übergeordnete Iframe weiterkommuniziert.

Desweitern erlaubt die Komponente das Setzen einer Bildunterschrift und einer (verlinkbaren) Quelle, via `caption` und `source`.

Und zu guter Letzt ist es auch noch möglich, das IFrame mit einem Zoom-Knopf via boolscher Eigenschaft `enlargable` auszustatten. 

 