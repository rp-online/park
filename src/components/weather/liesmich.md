Die Weather-Komponente besteht aus der [Slider](#slider)-Komponente, die [Card-Weather](#card-weather)-Komponenten enthält. Sie ist als [Widget](#widget) ausgelegt, also für den Mischbetrieb oder gar Exklusivbetrieb als clientseitig gerenderte Komponente. Das Widget-Script liegt unter `/assets/widgets/weather.js`.

Das Besondere an der Komponente ist, dass sie dadurch verschiedene Modi kennt: 

### Statischer Modus

Im statischen Modus wird sie ganz normal mit Verkehrsmeldungen per `initialState.items`-Eigenschaft bestückt, die sie dann serverseitig rausrendert. Und fertig.

### AJAX Modus

Im AJAX-Modus holt sich die Meldungen stattdessen von einer REST-Schnittstelle, deren Basis-URL man in der Eigenschaft `ajax.baseUrl` festlegt, und deren Standard-Region man in der Eigenschaft `ajax.defaultRegion` definiert. Erwartet wird an der Schnittstelle dieselbe Datenstruktur, wie beim Vorbefüllen in der `initialState`-Eigenschaft:

```
{
  "headline": {
    "tag": "h1",
    "text": "Wetter in Düsseldorf"
  },
  "aside": "Wetter in Düsseldorf powered by wetter.de",
  "items": [
    {
      "type": "weather",
      "headline": {
        "tag": "h2",
        "text": "Heute"
      },
      "temps": {
        "day": 24,
        "night": 8
      },
      "src": "https:\/\/www.rp-online.de\/app\/wetter\/img\/icons_gross.v4\/wolke_klein-sonne.png",
      "alt": "Symbolgrafik: Eine Wolke verdunkelt die Sonne",
      "href": "#void",
      "caption": "Sonnig, teils bewölkt"
    },
    { ... },
    {
      "type": "weather",
      "headline": {
        "tag": "h2",
        "text": "Übermorgen"
      },
      "temps": {
        "day": 24,
        "night": 8
      },
      "src": "https:\/\/www.rp-online.de\/app\/wetter\/img\/icons_gross.v4\/wolke_klein-sonne.png",
      "alt": "Symbolgrafik: Eine Wolke verdunkelt die Sonne",
      "href": "#void",
      "caption": "Sonnig, teils bewölkt"
    }
  ]
}
```

### Personalisierter Modus

Im personalisierten Modus, den man über die boolsche Eigenschaft `personalized` aktiviert, fragt das Widget per `window.park.user.getWeatherRegion()` (Promise) nach, ob der Benutzer irgendwelche Präferenzen hinsichtlich der Wetter-Region hinterlegt hat. Ist der Benutzer nicht authentifiziert oder hat der Benutzer keine Präferenzen angegeben, und antwortet die Promise damit mit `false`, erfolgt eine Ausgabe des Wetters der in `ajax.defaultRegion` vom Webseitenbetreiber festgelegten Standard-Region - wie wenn keine Personalisierung aktiv wäre. Ist der Benutzer hingegen authentifiziert und hat er Präferenzen angegeben, so liefert die Promise ein ein Objekt mit Überschrift und Wetterdaten, passend zur vom Benutzer eingestellten Wetter-Region zurück.  