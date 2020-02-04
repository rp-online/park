Diese Komponente stellt den gesamten Artikelkörper eines Artikels dar, mit Ausnahme des Kommentarbereichs.

### Folgende Datenwerte verdienen ein besonderes Augenmerk:

Der Wert `timestamp` steht für das anzuzeigende datum des Artikels. Der Wert wird an die `date`-Komponente weitergereicht, die automatisch dafür sorgt, dass in den ersten 10 Minuten nach dieser Zeitangabe ein "Aktualisiert vor X Minuten" ausgegeben wird.

<hr>

`cover` beherbergt das große Cover-Visual, mit dem der Artikel eröffnet wird. Das Visual kann entweder ein Bild sein, dann sieht die Datenstruktur folgendermaßen aus:

```
"cover": {
    "type": "image",
    "src": "./assets/images/950x534.jpg",
    "width": 950,
    "height": 526,
    "alt": "Das Kirmes-Riesenrad",
    "caption": "Das sind die Fahrgeschäfte und Attraktionen",
    "source": {
      "text": "Martin Gerten",
      "href": "http://www.martin-gerten.de"
    }
  }
``` 

Falls das Cover zu einer Bilderstrecke verlinken soll, kann es um die `link`-Eigenschaft ergänzt werden:

```
"cover": {
    "type": "image",
    "src": "./assets/images/950x534.jpg",
    "width": 950,
    "height": 526,
    "alt": "Das Kirmes-Riesenrad",
    "caption": "Das sind die Fahrgeschäfte und Attraktionen",
    "source": {
      "text": "Martin Gerten",
      "href": "http://www.martin-gerten.de"
    },
    "link": {
      "type": "image",
      "text": "17 Bilder",
      "href": "./bilderstrecke.html"
    }
  }
``` 

Und schließlich ist es auch möglich, kein Bild, sondern ein Video als Visual zu verwenden. In dem Fall sieht die Struktur so aus:

```
  "cover": {
    "type": "youtube",
    "id": "Chr5v2iWRyw",
    "title": "Martin Schulz: Noch kein Grünes Licht für GroKo",
    "href": "./"
  },
```

Das `href` in dieser Struktur führt zur dedizierten Videoseite dieses Videos.

<hr>

Die Werte aus der Eigenschaft `authorsbox` werden an die gleichnamige Komponente weitergegeben und dort auch [beschrieben](#authorsbox).

<hr>

In dem `ads`-Objekt können zwei bestimmte Plätze im Artikel mit Werbung bestückt werden:

1. Per `authors` der Platz unterhalb der Autorenbox (derzeit in Prod aber ungenutzt)
2. Per `article` ein Platz rechts von der Autorenbox

Wir die Daten darin genau weiterverarbeitet werden, steht in der [portal](#portal)-Komponente.

<hr>

Die `children`-Eigenschaft beherbergt mehr oder weniger arbiträre Artikel-Inhalte. Wie in anderen Komponenten mit `children`-Eigenschaft, besteht diese Struktur aus einem Array, bei dem jeder Eintrag ein Objekt mit den Eigenschaften `component` und `data` ist. `component` bezeichnet die in den Artikel-Inhalt einzuhängende Komponente und `data` bildet Datenstruktur ab, mit der diese Komponente befüttert werden soll.

Obwohl hier jegliche Komponente eingefügt werden kann, beschränkt sich die Praxis auf folgende:

* [article-content](#article-content): Richtext, übergeben in Markdown oder in HTML
* [slider](#slider): Slider/Unterbrecher mit Links zu passenden Artikeln, Bilder- oder Infostrecken
* [portal](#portal): Werbemittel
* [html](#html): Freies HTML (derzeit benötigt für Embeds)
* Embeds: Eine unserer vordefinierten embed-Komponenten (zukünftig geplant)

<hr>

Die boolsche Eigenschaft `reduced` wird gesetzt, wenn die Paywall zuschlägt. Der Artikel-Inhalt wird dann ausgeblendet.