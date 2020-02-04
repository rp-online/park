Diese Komponente ist unsere Primitive, um Videos (von YouTube) einzubinden.

Wenn es sich um vom Verlag produzierters Video handelt, dann muss die Eigenschaft `href` mit der URL zum entsprechenden (Video-)Beitrag auf der Verlags-Webseite versehen sein - auch wenn der Link üblicherweise gar nicht zu sehen sein wird. Ist der Link gesetzt und damit das Video damit als "intern" markiert, so wird das Abspielen desselben getrackt.

Soll das Abspeilen eines internes Video dennoch nicht getrackt werden, dann kann man zu diesem Zweck die boolsche Eigenschaft `doNotTrack` auf `true` setzen.

Darüberhinaus sollten folgende Eigenschaften noch gesetzt sein:

* `id`: Die YouTube-ID des Videos
* `title`: Der Titel des Videos