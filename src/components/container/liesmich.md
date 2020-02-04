Die Container-Komponente stellt einen nicht sichtbaren Container für Childen dar. Spezielle Anbieter erfordern, dass zusätzliches Markup im Quelltext eingebunden wird. 

Derzeit können im Markup folgende Konfiguration über die `data`-Eigenschaft mitgegeben werden:
- linkpulseGroup 
- taboolaNewsroomGroup

Die Inhalte werden Array von einzubindenden Kind-Komponenten in der `children`-Eigenschaft übergeben. Jeder Eintrag in diesem Array besteht aus einem Objekt mit den Eigenschaften `component` und `data`. `component` bezeichnet die in den Artikel-Inhalt einzuhängende Komponente und `data` bildet Datenstruktur ab, mit der diese Komponente befüttert werden soll.