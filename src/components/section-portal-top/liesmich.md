Diese Komponente ist ein besonderer Layout-Helfer, bei dem Werbung oben angeordnet wird und der Inhalt darunter.

Das Besondere bei dieser Komponente ist, dass sie den Werbeplatz beobachtet und den Inhaltsbereich weich nach unten fährt, wenn sie geladen wird - und zwar genau um die Distanz, die die Werbung selbst hoch ist.

Die Komponente wird nur einmal am Kopf der Webseite genutzt.

Die Werbung wird analog zur [Portal](#portal)-Komponente konfiguriert.

Die Inhalte werden als Array von einzubindenden Kind-Komponenten in der `children`-Eigenschaft übergeben. Jeder Eintrag in diesem Array besteht aus einem Objekt mit den Eigenschaften `component` und `data`. `component` bezeichnet die in den Artikel-Inhalt einzuhängende Komponente und `data` bildet die Datenstruktur für diese Komponente ab, mit der diese Komponente befüttert werden soll.

Wenn nur eine einzlene Kind-Komponente in den Inhaltsbereich der Section-Portal-Right eingefügt werden soll, dann kann diese alternativ auch in den Eigenschaften `component` und `data` direkt konfiguriert werden (wie in unserem Beispiel hier zu sehen).