Diese Komponente stellt den Fußbereich der Seite dar, einmal in normaler Ausprägung, einmal in kompakter Form für den personalisierten Bereich (zu aktivieren via der boolschen Globalen `config.personalArea`).

Der Fußbereich enthält auch die Daten für die [Navigation](#navigation), denn sie wird erst im Fußbereich ausgegeben, damit der eigentliche Seiteninhalt schneller auf dem Schirm ist.

Die Komponente wird gar nicht gerendert, wenn die Globale `config.appMode` auf `"embedded"` steht, weil dann nur Einzelteile der Seite in einer nativen App eingebunden werden. 