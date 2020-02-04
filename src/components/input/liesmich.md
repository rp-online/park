Die Input-Komponente ist ähnlich wie andere Eingabe-Komponenten recht komplex. Folgende Eigenschaften lassen sich konfigurieren:

* `id`: Eindeutige ID des Eingabefelds, falls benötigt
* `name`: Der Name des Eingabefelds
* `type`: Alle aus dem HTML-`<input>` bekannten Typen, zuzüglich des Typs `toggle`, der dem iOS-Schiebeschalter ähnelt. Default: `text`.
* `value`: Vorbelegtbarer Wert, z.B. für den Fall, dass die Richtigkeit einer Eingabe nur serverseitig geprüft werden kann.
* `label`: Beschriftung des Eingabefelds, zwingend erforderlich. HTML ist hier erlaubt.
* `labelHidden`: Boolscher Wert, der bestimmt, ob die Beschriftung versteckt werden soll.
* `placeholder`: Eingabehilfe in Form eines Beispiels im Eingabefeld
* `reversed`: Spiegelt die Anordnung von Beschriftung und Eingabefeld horizontal, wenn das umgebende Formular nicht sowieso im Vertikalen Anordnungsmodus eingestellt ist.
* `required`: Boolscher Wert, der bestimmt, ob das Feld zwingend ausgefüllt werden muss.
* `pattern`: Regulärer Ausdruck, gegen den die Eingabe matchen muss, um valide zu sein.
* `validationMessage`: Vorausgefüllte Fehlermeldungen, z.B. für den Fall, dass die Richtigkeit einer Eingabe nur serverseitig geprüft werden kann.
* `inputmode`: Kann genutzt werden, wenn man auf Geräten mit Software-Tastaturen [bestimmte Tasten bevorzugt angezeigt werden sollen](https://developer.mozilla.org/de/docs/Web/HTML/Element/Input), etwa Zahlen bei einem Text-Eingabefeld, ohne den Benutzer dabei zu zwingen, nur Zahlen nutzen zu müssen.
* `minlength`: Notwendige Mindestzeichenlänge, um eine valide Eingabe zu sein.
* `maxlength`: Notwendige Maximalzeichenlänge, um eine valide Eingabe zu sein.
* `autocomplete`: [autocomplete-Wert](https://developer.mozilla.org/de/docs/Web/HTML/Element/Input), der dem Browser mitteilt, welcher Wert in dem Eingabefeld vorausgefüllt erwartet wird. Kann zum Abschalten der Ausfüllhilfe auch auf `off` gesetzt werden.
* `disabled`: Schaltet das Eingabefeld ab. Das Formular validiert dann dieses Feld nicht mehr und es taucht auch nicht mehr beim Versenden an den Server auf.
* `readonly`: Schaltet jegliche Interaktion mit dem Feld durch den Benutzer ab, behandelt es aber sonst wie ein normales Eingabefeld.
* `hint`: Eine klein gedruckte Ausfüllhilfe. HTML ist hier erlaubt.

Bei Eingabefeldern des Typs `password` wird ein Passwort-Anzeigen-Knopf eingeblendet.