Diese Komponente bildet so eine Art Formularbaukasten. Folgende Eigenschaften nimmt die Komponente entgegen:

* `vertical`: Boolscher Wert, der bestimmt, ob Labels oberhalb des dazugehörigen Eingabefeld stehen sollen, anstatt links davon. Bei der RP ist diese Einstellung mittlerweile zum Standard geworden. Auf Mobile sind die Labels allerdings immer oberhalb.
* `action`: URL, an die das Formular beim Abschicken übermittelt werden soll
* `method`: Gibt die Sendemethode an, also GET oder POST
* `submit`: Bestimmt die Beschriftung auf dem Absenden-Knopf
* `children`: Nimmt ein Array von einzubindenden Kind-Komponenten auf. Jeder Eintrag in diesem Array besteht aus einem Objekt mit den Eigenschaften `component` und `data`. `component` bezeichnet die in den Artikel-Inhalt einzuhängende Komponente und `data` bildet Datenstruktur ab, mit der diese Komponente befüttert werden soll. Üblicherweise handelt es bei diesen Kind-Komponenten um [Inputs](#input), [Selects](#select), [Textareas](#textarea), [Radio-Groups](#radio-group), [Form-Fieldsets](#form-fieldset), [Form-Headlines](#form-headline), [Form-Instructions](#form-instruction) oder freies  [HTML](#html).
* `footerChildren`: Funktioniert wie `children`, nur dass die entsprechenden Kind-Elemente erst nach dem Absenden-Knopf auftauchen. Wird meist genutzt, um externe OAuth-Service-Knöpfe unterzubringen.

Das Formularlayout wird via CSS Grids realisiert.