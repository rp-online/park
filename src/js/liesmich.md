# JavaScript

Wie es heutzutage eigentlich üblich ist, schreiben wir unser JavaScript in EcmaScript 2015 (ES2015) Syntax. Die Wesentlichen Vorteile darin, dass man durch die verkürzte Funktions-Deklaration Tipparbeit spart und dass man durch let und const besseren IDE-Support erhält. Klassen nutzen wir nicht oder kaum. Mit Hilfe unseres Task-Runner erzeugen wir aus unseren Quelldateien concatenierte und minifizierte Dateien in ES2015- und ES5-Syntax. Neuere ES2015-fähige Browser bekommen via Feature-Detection die kompakteren ES2015-Dateien ausgespielt, ältere Browser sehen nur die Dateien im älteren ES5-Format.

Darüberhinaus nutzen wir hier und da ein paar neuere Browser-, DOM-, Objekt- oder Array-APIs. Diese polyfillen wir für ältere Browser. Erscheint uns ein Polyfill zu groß, dann wählen wir entweder einen weniger elaborierten Alternativweg für nicht unterstützende Browser, oder wir verzichten auf die Nutzung der API.

"Groß" ist hier ein gutes Stichwort, denn eine Maxime beim Design des Frontends war, die Menge JavaScript so gering wie möglich zu halten. Hintergrund ist, dass wir zwar alle JavaScript und seine Möglichkeiten sehr schätzen, es aber die initiale Ladezeit und auch Interaktionsbereitschaft einer Seite stark verzögert. Das liegt vor allem an Parse- und Ausführungszeiten, die auf Midrange-Android-Telefonen spürbar Zeit in Anspruch nehmen können. Würden wir eine Single Page Application entwickeln, wo das JavaScript nur einmal zu Beginn initialisiert würde, könnte man mehr Kompromisse eingehen, aber unser Produkt verarbeitet ein- und dasselbe JavaScript bei jedem Seitenabruf ja ständig aufs Neue.

Weil moderne Browser in der Zwischenzeit so viel weiter gereift sind, nutzen wir weder jQuery, noch irgendwelche jQuery-Plugins für Interface-Elemente, und auch kein Lodash. Das macht unser JavaScript schlank und ermöglicht uns ein indivuelleres Zuschneiden auf unsere Anforderungen.

Ähnliche wie es auf der jetzigen Präsenz der Fall ist, kapseln und exponieren wir verschiedene selnstgeschriebene APIs auf dem Objekt `window.park`. Untereinander kommunizieren tun Komponenten, wenn überhaupt erforderlich, via Custom Events.

Um eine möglichst schnelle Ladezeit zu erreichen, splitten wir das JavaScript in einen Teil, der direkt zu Beginn des Seitenladens benötigt wird, und in einen Teil, der asynchron nachgeladen wird.

## head.js

Die Datei, die von Beginn an zur Verfügung stehen muss, ist die `head.js`, und sie wird in den Kopf der Webseite ge-inlined. Sie speist sich zunächst aus allen JavaScript-Dateien in `/src/js/head/`, gefolgt von allen Dateien namens `head.js` in den Komponenten-Ordnern. Im Ordner `/src/js/head/` ist die Reihenfolge des Einlesens wichtig, bei den Komponenten nicht.

Nachfolgend ein Überblick über die Dateien im Ordner `/src/js/head/` und ihre Aufgabe:

### _exports.js

`window.park.exports`

Exponiert zum einen Teile des `config`-Blocks, der in die Seiten-Template geflossen ist, und zum anderen die MediaQueries, die im SASS definiert wurden, um in JavaScript dieselben Media Queries nutzen zu können.

### _storage.js

`window.park.storage`

Kapselt die Funktionen von `window.localStorage` und sichert sie gegen Browser ab, die kein Browser Storage zulassen (wie z.B. Safari im Incognito-Modus), und meldet einen solchen Browser über die boolsche `window.park.storage.disabled`-Eigenschaft zurück. Außerdem wurde die Fähigkeit hinzugefügt, auch Booleans, Arrays und Objekte, und anstatt nur Strings speichern zu können.  

Die bereitgestellten Methoden lauten:

`window.park.storage.set()`  
`window.park.storage.get()`  
`window.park.storage.remove()`  

Und dann gibt es noch die eben erwähnte boolsche Eigenschaft:

`window.park.storage.disabled`

### $.js

`window.park.$`

Stellt im Prinzip ein `document.querySelectorAll()` dar, nur dass hinten keine NodeList herausfällt, sondern ein Array von Nodes.


### ajax.js

`window.park.ajax`  

Vereinfacht die Arbeit mit AJAX-Calls. Ergänzt relative AJAX-URLs um den korrekten Pfad zum Root. Kann in einen JSON-P-Modus versetzt werden. Liefert eine Promise mit Methoden und Eigenschaften ähnlich der Fetch-API zurück: `.text()`, `json()`, `xml()`, `response()`, `status` und `request`. 

### app.js

`window.park.app`  

Fängt alle Aufrufe an `window.park.app` ab, solange die Widgets noch nicht geladen und bereit sind, und leitet später den Aufruf weiter.

### blocker.js

Dies stellt unser Adblocker-Utility dar. Dieses bietet drei Methoden:

`isActivated`
`deactivateChecksUntil`
`getReferrer`

`window.park.blocker.isActivated(callback)` findet heraus, ob der Benutzer einen Adblocker verwendet und führt einen übergebenen Callback mit einem Boolean als erstem Parameter aus.
`window.park.blocker.deactivateChecksUntil(isoDateString)` sorgt dafür, dass weitere Adblocker-Prüfungen bis zu dem genannten Zeitpunkt (in ISO-Notation) ausgesetzt werden.  
`window.park.blocker.getReferrer()` gibt einen ggf. die URL der zuletzt aufgerufenen Seite zurück.  

### click-recorder.js

Der Click-Rekorder zeichnet alle Click-Events auf, um sie später, wenn der Event-Hub geladen ist, wieder abzuspielen. Wenn jemand direkt zu Beginn zum Beispiel auf den Knopf für das Hauptmenü klickt, dann passiert am Anfang zwar immer noch nichts, aber das menü öffnet kurze Zeit später. Ohne den Klick aufzuheben, würde gar nichts passieren.

### console.js

`window.park.console`  

Arbeitet wird die normale Console, nur dass die Meldungen sichtbar anders formatiert sind.

### cookie.js

`window.park.cookie.set()`  
`window.park.cookie.get()`  

Helferlein zum Lesen und Schreiben von Cookies.

### device.js

`window.park.isMobile()`

Fragt ab, ob das aktuelle Gerät unter die Media Query für mobile Geräte fällt. 

Außerdem setzt die `device.js` eine der beiden CSS-Klassen `is-mobile` oder `is-desktop` auf dem `<html>`-Element und ändert sie zur Laufzeit, falls sie wechseln.

### fonts.js

Entfernt zunächst die Klasse `fonts-loaded` vom `<html>`-Element, um sie dann wieder zu setzen, wenn die Fonts erfolgreich geladen wurden. So kann die Seite schon einmal mit Fallback-Fonts gerendert werden, auch wenn die Schriften noch ein wenig brauchen. Das Wegnehmen zu Beginn hat den Hintergund, dass die Schriftklasse bei Browsern mit deaktiviertem JavaScript von Beginn an da stehen soll.  

### google-publisher-tag.js

Konfiguriert die Werbemittel.

### ivw.js

```
window.park.ivw.trackPageView()  
window.park.ivw.trackVideoPlay()  
window.park.ivw.trackSearchResult()
```

Stellt Tracking-Funktionen bereit und berücksichtigt dabei, ob der Benutzer auf Mobile oder Desktop ist.

### javascript-enabled.js

Entfernt die CSS-Klasse `js-disabled`vom `<html>`-Element.

### lazy-load.js

`window.park.lazyload`

Bild-Komponenten können sich hier registrieren und werden erst geladen, wenn sie sich im Viewport befinden. Zur Ermittlung wird die IntersectionObserver API genutzt, die viel performanter ist, als die Kombination aus Scroll-Events und `.getBoundingClientRect()`-Methode. Browser, die die IntersectionObserver API nicht unterstützen laden die Bilder einfach nicht nach, sondern laden sie alle gleich zu Beginn.

### mutation-observer.js

`window.park.observer.initialize(selector: String, callback: Function, lazy: Boolean)`

Sofern Komponenten eine JavaScript-Initialisierung benötigen, können Sie sich mit Ihrem Selektor und einer Callback-Funktion hier anmelden. Das DOM wird via MutionObserver API ständig auf neue Element überwacht. Haben sich Element mit ihren Selektoren angemeldet und passt ein neues Element zu dem angemeldeten Selektor, dann wird die Callback-Funktion ausgeführt, und zwar mit dem neu hinzugekommenen Element als einzigem Argument. Im IE 10, in dem die MutationObserver API noch nicht unterstützt wird, werden neue Elemente über CSS Animation Events erkannt.

### requestIdleTimeout.js

Polyfilled und ergänzt `window.requestIdleTimeout`.

### resource-loader.js

Vereinfacht das dynamische Nachladen von Stylesheets und JavaScript-Dateien. Wird von Artikel-Embeds genutzt, die externe Ressourcen zur Darstellung benötigen - z.B. ein Facebook Post oder Twitter Tweet. Außerdem führt das Helferlein Buch darüber, ob ein Script schon eingebunden wurde. So wird z.B. die Facebook-Bibliothek nicht mehrmals eingebunden, wenn es auf einer Seite mehrere Facebook Post Embeds gibt.

### safe-inputs.js

Mapped bei allen HTML-Input-Elementen die Eigenschaft `.value` um auf `.parkValue`. `.value`wird anschließend ausgetauscht durch einen Getter, der immer noch einen leeren String zurückliefert. Wer den wahren Input-Wert auslesen will, der muss nun auf `.parkValue` zugreifen. 

Hintergrund ist die kürzliche Entdeckung, dass diverse Werbemittel User über mehrere Seiten hinweg Markieren, indem Sie versteckte Formulare einbinden, die der Browser per Autofill mit den persönlichen Daten des Benutzers befüllt (inkl. Passwort). Und diese Daten werden dann ausgelesen und an den Anbieter zurück übermittelt. Das klappt bei uns (derzeit) nicht mehr.

Das Schreiben von Werten funktioniert übrigens weiterhin per `.value = 'Wert'`.

Soll in einem bestimmten Fall ein Input _doch_ wieder per `.value`-Attribut auslesbar gemacht werden, dann kann er in Form eines CSS-Selektors mit Hilfe der Methode `window.park.safeInputs.whitelistSelector` gewhitelistet werden und damit von der Behandlung ausgeschlossen werden. Beispiel: 

```
window.park.safeInputs.whitelistSelector('pt-field input');
```

### serviceworker.js

Registriert einen Service Worker.

### user.js

```
window.park.user.isLoggedIn()  
window.park.user.login()  
window.park.user.logout()  
window.park.user.getUsername()  
window.park.user.setItemBookmarkState()  
window.park.user.getItemBookmarkedState()  
window.park.user.getPreferredCities()  
window.park.user.getPreferredSportsclubs()  
window.park.user.getWeatherRegion()  
window.park.user.getTrafficRoads()  
window.park.user.getPreferences()  
window.park.user.setPreferences()  
window.park.user.setUser()  
window.park.user.getUser()
```

Ein Helferlein, mit dem sich verschiedene Benutzer-Daten und -Einstellungen lesen und setzen lassen.

### visibility.js

`window.park.visibility.isVisible(elem: Element)`

Ermittelt, ob ein Element gerade sichtbar und nicht von anderen Elementen verdeckt ist.

### widgets.js

`window.park.widgets.create()`

Erzeugt einen neuen Widget Container und gibt ihn zurück. 

## scripts.js

Die Datei, die asynchon nachgeladen wird, ist die `scripts.js`. Sie speist sich zunächst aus allen JavaScript-Dateien in `/src/js/foot/`, gefolgt von allen Dateien namens `scripts.js` in den Komponenten-Ordnern. Im Ordner `/src/js/foot/` ist die Reihenfolge des Einlesens wichtig, bei den Komponenten nicht.

Nachfolgend ein Überblick über die Dateien im Ordner `/src/js/foot/` und ihre Aufgabe:

### _cre-client.js

Entspricht eins zu eins der alten `tracking.js` (`window.cre_client`) und kapselt die Celera One Library.  

### api.js

```
window.park.api.login()  
window.park.api.logout()  
window.park.api.register()  
window.park.api.resetPassword()  
window.park.api.changePassword()  
window.park.api.verifyPassword()  
window.park.api.changeProfile()  
window.park.api.currentUser()  
window.park.api.getUserPreferences()  
window.park.api.setUserPreferences()  
window.park.api.addBookmark()  
window.park.api.deleteBookmark()  
window.park.api.createComment()
```

Ein Helferlein zur Vereinfachten Kommunikation mit der SSO API.

### cre.js

Übernimmt die Rolle, die vormals die `paywall-cre.js` übernommen hat: Sofern der benutzer sich auf einer Paywall-relevanten Artikelseite befindet, wird via `window.cre_client` ein Request an Cellera One abgesendet. Je nach Rückmeldung erzeugt sie Paywall-Hinweise oder aber die Paywall-Schranke. Außerdem entscheidet sie auch, ob dem Benutzer in entsprechend markierten Slots zugeschnittene Verlagsangebote ausgespielt werden sollen.

### event-hub.js

`window.park.eventHub.register(eventName: String, selector: String, callback: Funktion)`

Der Event-Hub kümmert sich zentral um Events. Dabei wird das Prinzip der Event-Delegation angewendet: Eventhandler werden nicht direkt an die eigentlichen Zielelemente gehängt, sondern es gibt einen zentralen "Horchposten" im DOM, über den alle Events laufen und der sie entsprechend weiterverarbeitet. Von der Handhabung entspricht der Event-Hub dem normalen Event-Listening.
  
`window.park.eventHub.trigger(elem: Node, eventName: String, data)`

Mit dieser Methode lassen sich beliebige (künstliche) Events auf dem angegebenen Element auslösen und mit eigenen Daten ergänzen.

### intersections.js

`window.intersections.observe(elem: Node, root: Node, callback: Funktion)`

Mit dieser Methode kann man überwachen, wann sich die Fläche des Element `elem` mit der Fläche von dem als `root` angegebenen Element überschneidet. Wenn `root` `null`ist, dann handelt es sich automatisch um den Viewport.

Immer wenn das Element beginnt zu überschneiden, oder es aus dem Überschneidungsbereich verschwindet, wird die Callback-Funktion mit einem Boolean als Argument ausgeführt. 

### ios-fix-svg-stacks.js

Repariert das Problem, dass der Safari-Browser keine SVG-Stacks untersützt.

### navigation-helper.js

```
window.park.navigationHelper.captureNav(elem: Node)  
window.park.navigationHelper.releaseNav(elem: Node)  
window.park.navigationHelper.enableArrowNav(selector: String, excludeSelector: String)
```

Helferlein, das die Keyboard-Navigation auf den Bereich innerhalb eines bestimmten Elements begrenzen und wieder aufheben kann (z.B. in einem Overlay). Desweiteren lässt sich innerhalb von Elementen mit bestimmten Selektoren die Pfeilcursor-Navigation aktivieren (z.B. im Hauptmenü oder in Select-Boxen). 

### notifications.js

Helferlein, um leichter Erfolgs- oder Fehlermeldungen einzublenden. 

### overlay-manager.js

```
window.park.overlayManager.register()  
window.park.overlayManager.unregister()  
window.park.overlayManager.close()  
window.park.overlayManager.open()
```

Dient der Anmeldung von Overlays. Erleichtert das Schichten von mehreren Overlays. Sorgt dafür, dass der Hintergrund abgesoftet bliebt, solange noch mindestens ein Overlay offen ist. Und schließt das oberste Overlay, sobald die Escape-Taste gedrückt wird oder auf den abgesofteten Hintergrund gedrückt wurde.

### richtext.js

Links in richtext-formatierten Elementen werden mit einem Unterstrich gestyled. Das funktioniert bei Texten sehr gut. Werden hingegen Bilder verlinkt, sieht das weniger gut aus. Das CSS nicht so angelegt werden kann, dass es schaut, was das Kind-Element des Links ist, gibt es dieses JavaScript, das alle Bild-Links um die Klasse `.park-richtext-image-link` ergänzt. Diese Links sind dann nicht mehr unterstrichen.  

### smooth-scroll.js

Bietet die zwei Methoden

```
window.park.smoothScroll.left()  
window.park.smoothScroll.top()
```

um die entsprechenden Elemente vertikel, respektive horizontal weich zu einer definierbaren Stelle zu scrollen.

Außerdem werden automatisch alle Links zu Srpungmarken mit weichem Scrollen ausgestattet.

### snackbar-manager.js

```
window.park.snackbarManager.register()  
window.park.snackbarManager.unregister()  
window.park.snackbarManager.close()  
window.park.snackbarManager.open()
```

Dient der Anmeldung von sogenannten "Snackbar-Notifications" am unteren Bildschirmrand. Erleichtert die Koordination mehrerer solcher Notifications auf einmal. Stellt entsprechende "Schließen"-Funktionalität zur Verfügung.

### tracker.js

Mappt diverse Events auf virtuelle IVW-PageViews um.
