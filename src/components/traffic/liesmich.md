Die Traffic-Komponente besteht aus der [Tab-Container](#tab-container)-Komponente, in die [Card-Traffic](#card-traffic)-Komponenten hineingeschachtelt sind. Sind es sechs oder weniger Staumeldungen, entfällt die Tab-Navigation und die Meldungen werden zusammen angezeigt. 

Die Komponente ist als [Widget](#widget) ausgelegt, also für den Mischbetrieb oder gar Exklusivbetrieb als clientseitig gerenderte Komponente. Das Widget-Script liegt unter `/assets/widgets/traffic.js`.

Das Besondere an der Komponente ist, dass sie dadurch verschiedene Modi kennt: 

### Statischer Modus

Im statischen Modus wird sie ganz normal mit Verkehrsmeldungen per `initialState.items`-Eigenschaft bestückt, die sie dann serverseitig rausrendert. Und fertig.

### AJAX Modus

Im AJAX-Modus holt sie sich die Meldungen stattdessen von einer REST-Schnittstelle, deren URL man in der Eigenschaft `ajax.url` festlegt. Erwartet wird dort dieselbe Datenstruktur, wie beim Vorbefüllen per `items`-Eigenschaft:

```
[
  {
    "headline": {
      "tag": "h2",
      "badge": "A10",
      "time": "05:03",
      "text": ""
    },
    "text": "A10 \u00d6stlicher Berliner Ring, Dreieck Spreeau Richtung Dreieck Barnim\nzwischen Dreieck Spreeau und Freienbrink\nGefahr durch Bergungsarbeiten auf dem rechten Fahrstreifen, rechter Fahrstreifen gesperrt"
  },
  { ... },
  {
    "headline": {
      "tag": "h2",
      "badge": "A10",
      "time": "10:49",
      "text": ""
    },
    "text": "A10 N\u00f6rdlicher Berliner Ring, Dreieck Havelland Richtung Dreieck Barnim\nzwischen Kreuz Oranienburg und Birkenwerder\nTagesbaustelle auf allen Fahrstreifen, Verkehr wird \u00fcber den Standstreifen geleitet, Stau, vorsichtig an das Stauende heranfahren"
  }
]
```

### Personalisierter Modus

Im personalisierten Modus, den man über die boolsche Eigenschaft `personalized` aktiviert, fragt das Widget per `window.park.user.getTrafficRoads()` (Promise) nach, ob der Benutzer irgendwelche Präferenzen hinsichtlich der Staumeldungen hinterlegt hat. Ist der Benutzer nicht authentifiziert oder hat der Benutzer keine Präferenzen angegeben, und antwortet die Promise damit mit `false`, erfolgt eine ungefilterte Ausgabe aller Staumeldungen - wie wenn keine Personalisierung aktiv wäre. Ist der Benutzer hingegen authentifiziert und hat er Präferenzen angegeben, so liefert die Promise ein Array an Verkehrsstracken zurück, die Benutzer gerne sehen möchte, z.B. `["A3", "A4"]`, und filtert die Ausgabe entsprechend.  