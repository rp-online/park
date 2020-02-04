Diese Helfer-Komponente hängt sich an alle Stellen, die im HTML ein `data-bookmark`-Attribut aufweisen. Diese Stellen werden damit zu Knöpfen, mit Hilfe derer ein Beitrag zur Leseliste hinzugefügt werden kann. Dafür muss das Attribut als Wert eine Beitrags-ID tragen.

Die Komponente prüft zudem beim Laden, ob der aktuelle Benutzer gerade angemeldet ist, und wenn ja, ob der Benutzer diese Beitrags-ID schon zur Leseliste hinzugefügt hat. Ist dies der Fall, wird sie farbig anders ausgezeichnet.

Außer dieser Programmlogik rüstet diese Helfer-Komponente noch Animationen nach.

Da die Information, dass ein Beitrag zur Leseliste hinzugefügt oder von der Leseliste entfernt wurde, sowohl im Browser als auch im SSO abgelegt werden muss, kommuniziert die Komponente sowohl mit `window.park.user` als auch mit `window.park.api`.