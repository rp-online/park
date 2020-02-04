Diese Komponente bettet ein Tickaroo Live-Blog ein. In der Datenstruktur werden verschiedene Einbettungsparameter konfiguriert: 

* `clientId`: Die Benutzerkennung des verlags
* `blogid`: Die ID des einzubettenden Live-Blogs
* `body`: HTML das angezeigt werden soll, bevor der Live-Blog geladen wurde
* `limit`: Anzahl auf einmal anzuzeigender Blog-Einträge
* `showEventSharing`: Boolscher Wert, der angibt, ob Share-Buttons angezeigt werden sollen
* `coalesceRepeatedMeta`: Boolscher Wert, der angibt, ob bei mehreren Beiträgen desselben Autors das Autorenbild nur einmal zusammenfassend angeziegt werden soll
* `reverseEvents`: Boolscher Wert, der angibt, ob die Eintragsreihenfolge umgekehrt werden soll   
* `useTileFormat`: Boolscher Wert, der angibt, ob die Einträge in Kachelform dargestellt werden sollen  

Zum Einsatz kommt diese Komponente ausschließlich im Artikel-Körper ([article](#article)).

Die Komponente schmeisst ein Event mit dem Namen `park.embed-tickaroo:pageview`, immer wenn der Benutzer weitere Einträge lädt oder er auf aktualisieren klickt. 