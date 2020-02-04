Diese Komponente stellt den Kopfbereich der Seite dar, einmal in normaler Ausprägung, einmal in reduzierter Form für den personalisierten Bereich (zu aktivieren via der boolschen Globalen `config.personalArea`).

Die Komponente wird gar nicht gerendert, wenn die Globale `config.appMode` auf `"embedded"` steht, weil dann nur Einzelteile der Seite in einer nativen App eingebunden werden.

Für vertriebliche Zwecke gibt es einen Eintrag `salesCta`, der im Falle einer Bestückung in einem Element `park-header__sales-cta` resultiert, das beim Erscheinen ein Event `park.header-sales-cta:impression` wirft und bei Klick `park.header-sales-cta:click`. Das Element erscheint derzeit auf Wunsch nur auf Mobile.  