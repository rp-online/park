# Architektur

Die Architektur verfolgt einen Komponenten-basierten Ansatz. Dieser Ansatz verringert die Abhängigkeiten zwischen verschiedenen Bereichen ein- und derselben Seite. Komponenten können im Idealfall an vielen Stellen recycelt werden. Und schlussendlich können neue Anforderungen an Seitenlayout durch Rekombination existierender Bausteine schneller bedient werden.

Manche Komponente besteht selbst nur aus Komponenten, manche Komponente ist ggf. nur ein Hilfskonstrukt.

Jede Komponenten existiert als Unterordner in `src/components`. Die überwiegende Mehrheit der Komponenten besteht aus folgenden, in diesem Ordner versammelten Dateien:

* eine `template.twig` beinhaltet die Template-Logik und das HTML
* eine `styles.scss` beinhaltet das CSS
* eine `scripts.js` beinhaltet schnell benötigten Initialisierungscode
* eine `scripts.js` beinhaltet unkritisches, später benötigtes Javascript

Hinzu kommt ein Ordner namens `data`, in dem mindestens in einer Datei namens `default.json` exemplarische Testdaten für die Komponente abgelegt sind. Wenn eine Komponente viele verschiedne Variationen von Daten verarbeiten können muss oder wenn sie verschiedene Statii annehmen kann, dann kann es dort auch noch mehr JSON-Dateien für die verschiedenen Zustände geben.

Ist es für eine Komponente erforderlich, dass sie per AJAX Daten nachlädt, dann kann es zum Testen zusätzlich noch den Unterordner `ajax` geben, der auch wiederum verschiedene JSON-Dateien beinhalten kann, je nachdem, ob verschiendene Varianten von AJAX-Daten durchgetestet werden solen.

### BEM-Nomenklatur

CSS-Klassen und Element-IDs orientieren sich von der Benennung an dem Ordner, in dem eine Komponente liegt. Außer dem Ordner kommt als Prefix noch der Codename des Template-Projekts davor: `park`.

Dementsprechend würde beispielsweise die Basis-CSS-Klasse des Elements im Ordner `image` `park-image` heißen. Das ermöglicht zum einen ein schnelles Lokalisieren der für eine Element zuständigen SASS-Datei, und es hilft, CSS-Leaks auf andere Elemente zu verhindern. Der `park`-Prefix wiederum dient dazu, ID- und CSS-Klassen-Kollisionen mit 3rd-Party-Elementen zu verhindern. Diese Prefixe werden übrigens auch für die Benennung der CSS-Animationen genutzt.

## Komponenten-Inventar

Bis dato wurden 136 Komponenten entwickelt. In alphabetischer Reihenfolge sind das:

* [action-buttons](https://templates:gera16@templates.park.works/components/action-buttons.html): Aktionsknöpfe für Beiträge (z.B. Drucken, zur Leseliste hinzufügen, etc.)
* __ads-oms__: Spezifische CSS und JavaScript-Anpassungen für die OMS Werbung 
* __aria-expanded-toggle__: Globale Funktionalität zum Auf- und Zuklappen von Interfaces 
* [article](https://templates:gera16@templates.park.works/components/article.html): Gesamter ArtikelKörper
* [article-content](https://templates:gera16@templates.park.works/components/article-content.html): Artikel-Inhaltsblock (Richtext-Ausgabe via HTML oder Markdown) 
* [article-paywall](https://templates:gera16@templates.park.works/components/article-paywall.html): Artikel-Paywalleinblendung
* [authorsbox](https://templates:gera16@templates.park.works/components/authorsbox.html): Autoreninfo im Artikel
* [back-to-article](https://templates:gera16@templates.park.works/components/back-to-article.html): "Zurück zum Artikel" Knopf (wird z.B. in Galerien und Infostrecken genutzt und erscheint nur wenn der Referer eine Artikelseite ist)
* [breaking](https://templates:gera16@templates.park.works/components/breaking.html): Eilmeldungen
* [button](https://templates:gera16@templates.park.works/components/button.html): generischer Knopf
* [button-arrow-toggle](https://templates:gera16@templates.park.works/components/button-arrow-toggle.html): Auf- und Zuklappknopf 
* [button-bookmark](https://templates:gera16@templates.park.works/components/button-bookmark.html): "Zu Lesezeichen hinzufügen/entfernen"-Knopf
* [calendar](https://templates:gera16@templates.park.works/components/calendar.html): Auswahlkalender für das Archiv
* [card-article](https://templates:gera16@templates.park.works/components/card-article.html): Artikel-Teaser in Kartenform
* [card-column](https://templates:gera16@templates.park.works/components/card-column.html): Kolumnen-Teaser in Kartenform
* [card-image](https://templates:gera16@templates.park.works/components/card-image.html): Bilderstrecken-Teaser in Kartenform
* [card-info](https://templates:gera16@templates.park.works/components/card-info.html): Infostrecken-Teaser in Kartenform
* [card-kalaydo](https://templates:gera16@templates.park.works/components/card-kalaydo.html): Kalaydo-Annonce in Kartenform
* [card-narrow](https://templates:gera16@templates.park.works/components/card-narrow.html): Generisches schmales Kartenelement
* [card-portal](https://templates:gera16@templates.park.works/components/card-portal.html): Werbeplatz in Kartenform
* [card-traffic](https://templates:gera16@templates.park.works/components/card-traffic.html): Stauinfo in Kartenform
* [card-twitter-tweet](https://templates:gera16@templates.park.works/components/card-twitter-tweet.html): Twitter Tweet in Kartenform
* [card-video](https://templates:gera16@templates.park.works/components/card-video.html): Video-Teaser in Kartenform
* [card-weather](https://templates:gera16@templates.park.works/components/card-weather.html): Wetterinfo in Kartenform
* [cards-container](https://templates:gera16@templates.park.works/components/cards-container.html): Generischer mehrspaltiger Container für Kartenelemente
* [comments](https://templates:gera16@templates.park.works/components/comments.html): Listenförmige Kommentare
* [comments-form](https://templates:gera16@templates.park.works/components/comments-form.html): Kommentar Formular
* [conditional-component-iterator](https://templates:gera16@templates.park.works/components/conditional-component-iterator.html): Generisches Element zur gesteuerten Ausgabe von Subelementen 
* [contact](https://templates:gera16@templates.park.works/components/contact.html): Kontaktinformationsblock (z.B. "Ihr Kontakt zur Redaktion")
* [content](https://templates:gera16@templates.park.works/components/content.html): Generischer gestylter Ausgabeblock für Richtext in HTML oder Markdown
* [countdown](https://templates:gera16@templates.park.works/components/countdown.html): Sekundenzähler
* __data-bookmark__: Globale Funktion zum Hinzufügen oder Löschen von Lesezeichen
* __data-print__: Globale Druckfunktion 
* [date](https://templates:gera16@templates.park.works/components/date.html): Datumsausgabe, die eine Darstellung "vor zehn Minuten" beherrscht
* [dossier-content](https://templates:gera16@templates.park.works/components/dossier-content.html): Content-Block, den man auf Dossier-Seiten nutzen kann
* [edit-profile](https://templates:gera16@templates.park.works/components/edit-profile.html): Formular für das Editieren des Benutzerprofils
* [embed-facebook-post](https://templates:gera16@templates.park.works/components/embed-facebook-post.html): Artikel-Embed für Facebook-Posts
* [embed-iframe](https://templates:gera16@templates.park.works/components/embed-iframe.html): Artikel-Embed für Iframes
* [embed-image](https://templates:gera16@templates.park.works/components/embed-image.html): Artikel-Embed für Bilder
* [embed-infobox](https://templates:gera16@templates.park.works/components/embed-infobox.html): Artikel-Embed für Infoboxen
* [embed-instagram-post](https://templates:gera16@templates.park.works/components/embed-instagram-post.html): Artikel-Embed für Instagram-Posts
* [embed-playbuzz](https://templates:gera16@templates.park.works/components/embed-playbuzz.html): Artikel-Embed für Playbuzz
* [embed-tickaroo](https://templates:gera16@templates.park.works/components/embed-tickaroo.html): Artikel-Embed für Tickaroo
* [embed-twitter-tweet](https://templates:gera16@templates.park.works/components/embed-twitter-tweet.html): Artikel-Embed für Twitter Tweets
* [embed-video](https://templates:gera16@templates.park.works/components/embed-video.html): Artikel-Embed für Videos
* [enter-password](https://templates:gera16@templates.park.works/components/enter-password.html): Formular zur Passwortabfrage
* [fakebody](https://templates:gera16@templates.park.works/components/fakebody.html): Dieses Element hängt sich in `document.body` und bringt Werbung unter seine Kontrolle
* [figure](https://templates:gera16@templates.park.works/components/figure.html): Bild mit Bildunterschrift
* [footer](https://templates:gera16@templates.park.works/components/footer.html): Seiten-Fußzeile
* [form](https://templates:gera16@templates.park.works/components/form.html): Generischer Formular-Baukasten
* [form-fieldset](https://templates:gera16@templates.park.works/components/form-fieldset.html): Generisches Fieldset
* [form-headline](https://templates:gera16@templates.park.works/components/form-headline.html): Formular Überschrift
* __fullscreen__: Generische Funktion, um Seitenelemente in den Vollbildmodus zu versetzen
* [gallery](https://templates:gera16@templates.park.works/components/gallery.html): Bilder- oder Infostrecken-Körper
* [header](https://templates:gera16@templates.park.works/components/header.html): Seiten-Kopf mit Hauptmenü
* [html](https://templates:gera16@templates.park.works/components/html.html): Generisches Element zur Ausgabe von HTML
* [iframe](https://templates:gera16@templates.park.works/components/iframe.html): Generisches Element zum Einbinden von Iframes
* [image](https://templates:gera16@templates.park.works/components/image.html): Generisches Element für Bilder (lazyloadend)
* [image-comparison](https://templates:gera16@templates.park.works/components/image-comparison.html): Generisches Element zum Vergleich zweier Bilder
* [input](https://templates:gera16@templates.park.works/components/input.html): Generisches Input-Element
* [linkpulse](https://templates:gera16@templates.park.works/components/linkpulse.html): Generisches Linkpulse-Element
* [login](https://templates:gera16@templates.park.works/components/login.html): Formular für den Login
* [markdown](https://templates:gera16@templates.park.works/components/markdown.html): Generisches Element zur Ausgabe von Markdown
* [navigation](https://templates:gera16@templates.park.works/components/navigation.html): Offcanvas-Hauptmenü
* [navigation-item](https://templates:gera16@templates.park.works/components/navigation-item.html): Eintrag im Hauptmenü
* [navigation-section](https://templates:gera16@templates.park.works/components/navigation-section.html): Mehrspaltiger Hauptmenübereich
* [new-password](https://templates:gera16@templates.park.works/components/new-password.html): Formular zur Eingabe eines neuen Passworts
* [newsletter](https://templates:gera16@templates.park.works/components/newsletter.html): Formular zur Anmeldung für den Newsletter
* [notification](https://templates:gera16@templates.park.works/components/notification.html): Erfolgs- oder Fehlerbenachrichtigung für Formularaktionen
* [obfuscator](https://templates:gera16@templates.park.works/components/obfuscator.html): Element zur Verschleierung von E-Mail-Links oder -Adressen
* [offer](https://templates:gera16@templates.park.works/components/offer.html): Element, das ein Verlagsangebot bewirbt
* [offer-slot](https://templates:gera16@templates.park.works/components/offer-slot.html): Element, das ein eine Stelle zum dynamischen Einfügen eines `offer`-Elements markiert
* [opener](https://templates:gera16@templates.park.works/components/opener.html): Prominentes Bild im Kopfbereich von Index-Seiten
* [outbrain](https://templates:gera16@templates.park.works/components/outbrain.html): Generisches Outbrain-Element
* [overlay](https://templates:gera16@templates.park.works/components/overlay.html): Generisches Overlay Element, das man mit Inhaltselementen bestückt
* [page-footer](https://templates:gera16@templates.park.works/components/page-footer.html): Generisches Abschlusselement Hauptinhaltsbereiche
* [page-header](https://templates:gera16@templates.park.works/components/page-header.html): Generisches Intro-Element für Hauptinhaltsbereiche
* [page-headline](https://templates:gera16@templates.park.works/components/page-headline.html): Überschrift in einem generischen Intro-Element
* [page-opener](https://templates:gera16@templates.park.works/components/page-opener.html): Generisches Intro-Element mit Bild für Hauptinhaltsbereiche
* [pager-previous-next](https://templates:gera16@templates.park.works/components/pager-previous-next.html): Seiten-Blätter-Element
* [portal](https://templates:gera16@templates.park.works/components/portal.html): Generisches Element zur (responsiven) Werbeeinbettung
* [portal-marker](https://templates:gera16@templates.park.works/components/portal-marker.html): Wrapper für Elmente, die mit einer Anzeigen-Kennzeichnung ausgestattet werden sollen
* [profile](https://templates:gera16@templates.park.works/components/profile.html): Formular zum Bearbeiten des Benutzerprofils
* [quick-nav](https://templates:gera16@templates.park.works/components/quick-nav.html): Schnellnavigation im Kopfbereich der Startseite
* [quick-nav-item](https://templates:gera16@templates.park.works/components/quick-nav-item.html): Eintragselement in der Schnellnavigation
* [radio-group](https://templates:gera16@templates.park.works/components/radio-group.html): Generisches Element für zusammenhängende Radios
* [registration](https://templates:gera16@templates.park.works/components/registration.html): Formular für die Registrierung
* [relatedlines](https://templates:gera16@templates.park.works/components/relatedlines.html): Link zu verwandten Artikeln in Teaser-Elementen
* [reset-password](https://templates:gera16@templates.park.works/components/reset-password.html): Formular zum Zurücksetzen des Passworts
* [search](https://templates:gera16@templates.park.works/components/search.html): Komplette Suche inklusive Formular und Ergebnisliste
* [search-adsense](https://templates:gera16@templates.park.works/components/search-adsense.html): Google Adsense Einbettung in den Suchergebnissen
* [search-tipp](https://templates:gera16@templates.park.works/components/search-tipp.html): Suchtipp zur Einbledung in den Suchergebnissen
* [searchform](https://templates:gera16@templates.park.works/components/searchform.html): Suchformular
* [section](https://templates:gera16@templates.park.works/components/section.html): Abschnittsblock
* [section-breadcrumb](https://templates:gera16@templates.park.works/components/section-breadcrumb.html): Breadcrumb-Navigation
* [section-footer](https://templates:gera16@templates.park.works/components/section-footer.html): Abschnittsfußbereich
* [section-headline](https://templates:gera16@templates.park.works/components/section-headline.html): Abschnittsüberschrift
* [section-nav](https://templates:gera16@templates.park.works/components/section-nav.html): Abschnitts-Navigation
* [section-portal-right](https://templates:gera16@templates.park.works/components/section-portal-right.html): Layoutcontainer für Werbung auf der rechten Seite
* [section-portal-top](https://templates:gera16@templates.park.works/components/section-portal-top.html): Layoutcontainer für Werbung oberhalb des Inhalts
* [section-quick-nav](https://templates:gera16@templates.park.works/components/section-quick-nav.html): Abschnitts-Navigation
* [section-sidebar](https://templates:gera16@templates.park.works/components/section-sidebar.html): Layoutcontainer für paralleln Inhalt auf der rechten Seite
* [select](https://templates:gera16@templates.park.works/components/select.html): Generisches Dropdown
* [settings](https://templates:gera16@templates.park.works/components/settings.html): Formular für die persönlichen Einstellungen
* [slider](https://templates:gera16@templates.park.works/components/slider.html): Slider-Element für Teaser-Karten
* [snackbar](https://templates:gera16@templates.park.works/components/snackbar.html): Info-Element am unteren Rand des Browserfensters
* [snackbar-cookies](https://templates:gera16@templates.park.works/components/snackbar-cookies.html): `snackbar`-Element für die Cookie-Information
* [snackbar-paywall](https://templates:gera16@templates.park.works/components/snackbar-paywall.html): `snackbar`-Element für die Paywall-Benachrichtigungen
* [snackbar-portal](https://templates:gera16@templates.park.works/components/snackbar-portal.html): `snackbar`-Element für Werbeeinblendungen am unteren Rand
* [social-buttons](https://templates:gera16@templates.park.works/components/social-buttons.html): Social Sharing Knöpfe
* [spacer](https://templates:gera16@templates.park.works/components/spacer.html): Trennlinienelement
* [tab-container](https://templates:gera16@templates.park.works/components/tab-container.html): Element zum Gruppieren von Inhalten zum Durchtabben
* [tab-links](https://templates:gera16@templates.park.works/components/tab-links.html): Tab im `tab-container`
* [tab-teaser-results](https://templates:gera16@templates.park.works/components/tab-teaser-results.html): Element zum Gruppieren von Suchergebnissen zum Durchtabben
* [tags](https://templates:gera16@templates.park.works/components/tags.html): Tagcloud
* [teaser](https://templates:gera16@templates.park.works/components/teaser.html): Großer Beitragsteaser
* [teaser-bookmark-list](https://templates:gera16@templates.park.works/components/teaser-bookmark-list.html): Lesezeichenliste 
* [teaser-collection](https://templates:gera16@templates.park.works/components/teaser-collection.html): Eine Liste von großen horizontalen Beitragsteasern
* [teaser-image-list](https://templates:gera16@templates.park.works/components/teaser-image-list.html): Eine Liste von kleinen Beitragsteasern mit Bild
* [teaser-image-list-item](https://templates:gera16@templates.park.works/components/teaser-image-list-item.html): Kleiner Beitragsteaser mit Bild
* [teaser-list](https://templates:gera16@templates.park.works/components/teaser-list.html): Eine Liste von kleinen Beitragsteasern ohne Bild
* [teaser-list-item](https://templates:gera16@templates.park.works/components/teaser-list-item.html): Kleiner Beitragsteaser ohne Bild
* [teaser-shapeshifter](https://templates:gera16@templates.park.works/components/teaser-shapeshifter.html): Teaser-Liste, die je nach Teasertyp wie eine `teaser-collection` oder `teaser-tiles` aussieht
* [teaser-tiles](https://templates:gera16@templates.park.works/components/teaser-tiles.html): Eine Liste von großen kartenförmigen Beitragsteasern
* [textarea](https://templates:gera16@templates.park.works/components/textarea.html): Generische Textarea
* [traffic](https://templates:gera16@templates.park.works/components/traffic.html): Liste von Staumeldungen
* [user-menu](https://templates:gera16@templates.park.works/components/user-menu.html): Benutzeraktionen-Dropdown-Menü
* [vgwort](https://templates:gera16@templates.park.works/components/vgwort.html): VG-Wort-Pixel
* [video](https://templates:gera16@templates.park.works/components/video.html): Generisches Video-Element
* [video-list](https://templates:gera16@templates.park.works/components/video-list.html): Liste von Video-teasern
* [video-list-item](https://templates:gera16@templates.park.works/components/video-list-item.html): Video-Teaser 
* [video-with-caption](https://templates:gera16@templates.park.works/components/video-with-caption.html): Video-Element mit Beschreibung
* [wallpaper-portal](https://templates:gera16@templates.park.works/components/wallpaper-portal.html): Element zur Aufnahme des Wallpapers
* [weather](https://templates:gera16@templates.park.works/components/weather.html): Liste von Wettermeldungen
* [welcome](https://templates:gera16@templates.park.works/components/welcome.html): Post-Login-Willkommens-Overlay
* [widget](https://templates:gera16@templates.park.works/components/widget.html): Generisches Element zum Platzieren von clientseitig gerenderten Widgets
