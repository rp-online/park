Diese Komponente ist ein Layout-Helfer, der dafür sorgt, dass auf Desktop Inhalte links und Werbung rechts angeordnet ist. Auf mobile befindet sich die Werbung oben und der Inhalt darunter.

Die Werbung wird analog zur [Portal](#portal)-Komponente konfiguriert.

Die Inhalte werden Array von einzubindenden Kind-Komponenten in der `children`-Eigenschaft übergeben. Jeder Eintrag in diesem Array besteht aus einem Objekt mit den Eigenschaften `component` und `data`. `component` bezeichnet die in den Artikel-Inhalt einzuhängende Komponente und `data` bildet Datenstruktur ab, mit der diese Komponente befüttert werden soll.

Wenn nur eine einzlene Kind-Komponente in den Inhaltsbereich der Section-Portal-Right eingefügt werden soll, dann kann diese alternativ auch in den Eigenschaften `component` und `data` direkt konfiguriert werden (wie in unserem Beispiel hier zu sehen).