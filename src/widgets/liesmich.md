# Client-seitige Widgets

Die folgenden Komponenten werden nicht serverseitig, sondern rein clientseitig mit Hilfe unseres an React angelehnten, aber mit Twig als Templatesprache arbeitenden App-Framework gerendert:

* __bookmarks__: Die persönliche Leseliste des Benutzers 
* __edit-profile__: Das Editieren des eigenen Profils
* __login__: Der Login
* __new-password__: Das eingeben eines neuen Passworts
* __notification-overlay__: Hinweis-Overlays
* __offer__: Das einblenden von maßgeschneiderten Verlagsangeboten
* __paywall-article__: Die Paywall-Einblendung
* __paywall-notification__: Die Paywall-Benachrichtigung
* __personal-area__: Die persönlichen Einstellungen
* __register__: Die Benutzerregistrierung
* __reset-password__: Das Passwort zurücksetzen
* __search__: Die Suche (die initiale Ergebnisliste kommt vom Server, der Rest wird dann vom Client gemanaged)
* __traffic__: Die persönlichen Stauinfos
* __weather__: Die persönlichen Wetterinfos

Die Datei `vendor.js` beinhaltet die gesamte Kernlogik bestehend aus:

* Clientseitgen Twig-Compiler (Twig.js)
* Virtual DOM Differ (morphdom)
* State-Manager (Redux)

Einmal kompiliert und minifiziert, liegen die Widget-Dateien unter `/dist/assets/widgets/` und können bei Bedarf einzaln nachgeladen werden.

Außerdem liegt dort auch die Datei `templates.json`, in der alle Twig-Templates in einem großen JSON-Objekt liegen, und die die `vendor.js` zum Rendern nutzt.

