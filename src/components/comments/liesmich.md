Diese Komponente stellt die Kommentare unterhalb des Artikel-Körpers ([article](#article)) dar. Folgende Eigenschaften verdienen ein besonderes Augenmerk:

* `disabled`: Boolscher Wert, der auf `true` stehen muss, wenn ein Artikel keine Kommentare erlaubt
* `discussion`: Dieses Objekt beinhaltet die Basis-URLs für die REST-Endpunkte, aus denen die anzuzeigenden Kommentare und die Kommentaranzahl gezogen werden.  

Wenn der Benutzer nicht eingeloggt ist, dann wird das Formular ausgeblendet.

Die von der Komponente erwartete JSON-Struktur für den Kommentare sieht folgendermaßen aus:

```
[
  {
    "id": "c6808744-c44b-44b8-8ee7-0d6999bc34e0",
    "user": "Erin Rice",
    "time": 1462837295,
    "popularity": 719,
    "text": "Consectetur sit ipsum nisi excepteur velit excepteur anim. Minim aute et proident cupidatat ullamco duis culpa excepteur irure. Ipsum eu ut fugiat qui in ea pariatur sunt nulla dolore.\n\nId excepteur culpa consequat ullamco amet ad sint sit duis est dolore anim proident. Dolore velit id ex mollit. Laboris cillum occaecat incididunt tempor aute consectetur consequat. Minim ex veniam officia adipisicing sunt deserunt mollit magna. Enim sunt tempor laborum dolor laborum consequat.\n\n"
  },
  { ... },
  {
    "id": "981b9e43-78c9-4bda-ac34-5ffa650f6882",
    "user": "Kemp Clemons",
    "time": 1463634890,
    "popularity": 156,
    "text": "Lorem anim do aliqua enim quis eu est irure elit sunt dolor elit non. Eu do tempor non et mollit fugiat ut reprehenderit eu dolor dolor nisi nisi. Nostrud ea elit amet eiusmod. Exercitation minim ullamco voluptate culpa. Laboris veniam nulla esse minim mollit minim id irure excepteur nisi officia cillum exercitation deserunt.\n\nCupidatat anim cupidatat et magna deserunt est ea dolor ullamco ipsum. Incididunt mollit minim Lorem esse ipsum deserunt est deserunt non magna. In nostrud nostrud amet laboris est ad quis. Aliquip fugiat esse et elit veniam dolore commodo incididunt.\n\nDuis incididunt anim occaecat commodo ut qui aliquip esse magna dolor voluptate sunt consequat Lorem. Aliqua dolore fugiat sunt enim voluptate dolore. Laboris aliqua eu sint Lorem cupidatat. Anim elit in aute elit culpa proident sunt enim excepteur do sit irure ipsum exercitation. In laboris nostrud est id esse Lorem consectetur do sint.\n\n"
  }
]
```

Als GET-Parameter für das Blättern werden `offset` und `limit` mitgegeben (ähnlich wie bei SQL). `limit` steht immer auf 11, auch wenn nur 10 Kommentare auf einmal angezeigt werden. So erkennt die Komponente anhand der Menge zurückgelieferter Ergebnisse, ob der "Weitere Kommentare laden"-Knopf eingeblendet bleiben soll, oder nicht (und setzt in dem Fall die CSS-Klasse `park-comments--is-complete`). Für die Sortierreihenfolge gibt es den Parameter `order` mit den Optionen `asc` oder `desc`.

Die von der Komponente erwartete JSON-Struktur für die gesamte Kommentaranzahl sieht so aus:

```
{ 
  "count": 42 
}
```
