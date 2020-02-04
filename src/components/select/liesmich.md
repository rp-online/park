Die Input-Komponente ist ähnlich wie andere Eingabe-Komponenten recht komplex. Folgende Eigenschaften lassen sich konfigurieren:

* `name`: Der Name des Eingabefelds
* `value`: Vorbelegtbarer Wert, z.B. für den Fall, dass die Richtigkeit einer Eingabe nur serverseitig geprüft werden kann.
* `label`: Beschriftung des Eingabefelds, zwingend erforderlich. HTML ist hier erlaubt.
* `labelHidden`: Boolscher Wert, der bestimmt, ob die Beschriftung versteckt werden soll.
* `placeholder`: Eingabehilfe in Form eines Beispiels im Eingabefeld
* `required`: Boolscher Wert, der bestimmt, ob das Feld zwingend ausgefüllt werden muss.
* `validationMessage`: Vorausgefüllte Fehlermeldungen, z.B. für den Fall, dass die Richtigkeit einer Eingabe nur serverseitig geprüft werden kann.
* `autocomplete`: [autocomplete-Wert](https://developer.mozilla.org/de/docs/Web/HTML/Element/Input), der dem Browser mitteilt, welcher Wert in dem Eingabefeld vorausgefüllt erwartet wird. Kann zum Abschalten der Ausfüllhilfe auch auf `off` gesetzt werden.
* `disabled`: Schaltet das Eingabefeld ab. Das Formular validiert dann dieses Feld nicht mehr und es taucht auch nicht mehr beim Versenden an den Server auf.
* `readonly`: Schaltet jegliche Interaktion mit dem Feld durch den Benutzer ab, behandelt es aber sonst wie ein normales Eingabefeld.
* `hint`: Eine klein gedruckte Ausfüllhilfe. HTML ist hier erlaubt.
* `multiple`: Boolscher Wert, der steuert, ob mehrere Werte ausgewählt werden können
* `max`: Zahl, die im Falle von `multiple` bestimmt, wieviele Werte maximal ausgewählt werden können.
* `options`: ein Array von Einträgen, die selbst wiederum aus den Eigenschaften `label` und `value` bestehen.