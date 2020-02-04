Die Snackbar-Komponente ist eine Primitive zur Einblendung von Inhalten am unteren Bildschirmrand. Mehrere Snackbars werden automatisch gestapelt, so dass sie sich nicht überdecken. Und jede Snackbar kommt standardmäßig mit einem Schließen-Knopf daher. Außer, man setzt den Wert `closeButton` auf `false`.

Jede Snackbar meldet sich bei der Snackbar-Manager-API an, so dass jede Snackbar mit Hilfe Ihrer `id` aus JavaScript heraus geöffnet und geschlossen werden kann:

```
window.park.snackbarManager.open(snackbarId);
```

Und:

```
window.park.snackbarManager.close(snackbarId);
```

Soll eine Snackbar direkt vom Start weg geöffnet sein, dann muss zusätzlich die boolsche Eigenschaft `startOpened` auf `true` gesetzt werden.

Die Inhalte der Snackbars werden als Array von einzubindenden Kind-Komponenten in der `children`-Eigenschaft übergeben. Jeder Eintrag in diesem Array besteht aus einem Objekt mit den Eigenschaften `component` und `data`. `component` bezeichnet die in den Artikel-Inhalt einzuhängende Komponente und `data` bildet Datenstruktur ab, mit der diese Komponente befüttert werden soll.

