Mit Hilfe dieser Komponente lässt sich ein Overlay definieren, das nach dem Öffnen in der Mitte des Bildschirms schwebt und den Hintergrund absoftet. Außerdem hat das Overlay einen Schließen-Knopf und es lässt sich auch durch Drücken der ESC-Taste oder durch Klick auf den abgesofteten Hintergrund schließn.

Werden mehrere Overlays übereinander geöffnet, dann wird bei den oben genannten Aktionen immer nur das jeweils oberste Overlay geschlossen.

Standardmäßig ist das Overlay geschlossen und nicht sichtbar. Damit das Overlay aus JavaScript heraus angesteuert werden kann, muss es eine eindeutige ID über die Eigenschaft `id` erhalten. Dann lässt es sich mit Hilfe des OverlayManagers öffnen...

```
window.park.overlayManager.open(overlayId);
```

... und schließen ...

```
window.park.overlayManager.close(overlayId);
```

Soll ein Overlay direkt vom Start weg geöffnet sein, dann muss zusätzlich die boolsche Eigenschaft `startOpened` auf `true` gesetzt werden.

Da ein Overlay ohne Inhalt nur ein halbes Overlay ist, lässt sich dem Overlay (wie diversen anderen Komponenten auch) ein Array von einzubindenden Kind-Komponenten in der `children`-Eigenschaft übergeben. Jeder Eintrag in diesem Array besteht aus einem Objekt mit den Eigenschaften `component` und `data`. `component` bezeichnet die in den Artikel-Inhalt einzuhängende Komponente und `data` bildet Datenstruktur ab, mit der diese Komponente befüttert werden soll.

 