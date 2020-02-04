Diese Komponente kapselt alles, was für einen Eintrag im Hauptbereich der Hauptnavigation notwendig ist. Sie kann wiederum selbst Untermenüs einbinden. In diesem Fall lässt sich das Untermenü per Knopf aufklappen.

Ist in einem der Untermenüs ein Menüpunkt als `isCurrent` markiert, dann wird der Menüeintrag vom Start weg als geöffnet präsentiert.

Ist der Menüeintrag selbst derjenige, der mit `isCurrent` markiert ist, so wird er unterlegt dargestellt.

Falls die Eigenschaftengruppe `search` definiert ist, dann wird ein zusätzliches Suchfeld für die aktuellen Untermenüpunkte eingeblendet, mit deren Hilfe diese Untermenüpunkte gefiltert werden können.

Ist eine solche Suche vorgesehen, dann ist es möglich, Untermenüpunkte mit `featured` zu kennzeichnen. Tut man dies, dann werden in dem durchsuchbaren Menü anfangs nur diese "gefeaturedten" Untermenüpunkt angezeigt. Gibt der Benutzer anschließend etwas in das Suchfeld ein, dann werden alle passenden Treffer offenbart, egal ob featured oder nicht.