Diese Komponente stellt die Primitive dar, mit der Bilder auf der Seite eingebunden werden. Sie sorgt dafür, dass Bilder erst geladen werden, wenn Sie in den Bildausschnitt gelangen, außer man setzt die Eigenschaft `lazy` explizit auf `false`.

Die URL des anzuzeigenden Bilds wird als String an die `src`-Eigenschaft übergeben.

Gleichzeitig ist es aber auch möglich, diese Komponente verschiedene Bilder responsiv ausliefern zu lassen. Dafür sind zwei Dinge nötig:

Zum einen müssen verschiedene Auflösungen des Bildes in Form eines Objekts an die `src`-Eigenschaft übergeben werden:   

```json
"src": {
    "400w": "https://placehold.it/400x225",
    "600w": "https://placehold.it/600x337",
    "900w": "https://placehold.it/900x506",
    "1200w": "https://placehold.it/1200x675",
    "1600w": "https://placehold.it/1600x1125"
  }
```

Der Key (z.B. `900w`) steht für die reale Pixel-Auflösung des in der Value hinterlegten Bildes. Wir empfehlen genau die im Beispiel gezeigten Auflösungsstufen.

Zum anderen muss in der `sizes`-Eigenschaft angegeben werden, welche Breite das Bild auf Mobilgeräten und auf Desktops einnehmen wird:

```json
"sizes": {
    "mobile": "100vw",
    "desktop": "950px"
}
```   

Die Breite wird in CSS-Units angegeben. Bei dem gezeigten Beispiel handelt es sich um ein Bild, das auf Mobilgeräten über die volle Bildschirmbreite geht und auf Desktops 950 Pixel breit ist.

Wie von Bildern im Web gewohnt, müssen zusätzlich `width` und `height` übergeben werden, wobei es bei den Werten eigentlich nur darauf ankommt, dass sie das korrekte Seitenverhältnis beschreiben.

In einer `alt`-Eigenschaft wird eine textuelle Beschreibung des dargestellten Motivs übergeben. 

Schlussendlich beherrscht die Komponente Cropping und Letterboxing via `fit`-Attribut mit den Werten `cover` oder `contain`.

Ist die Globale `config.keys.imageEngine` gesetzt, und liegt damit eine Lizenz zur Nutzung der [Scientia Mobile Image Engine](https://www.scientiamobile.com/page/imageengine) vor, dann schickt die Image_komponente alle URLs durch den Optimierer und bindet zusätzlich ein sehr niedrig aufgelöstes Vorschaubild ein. 