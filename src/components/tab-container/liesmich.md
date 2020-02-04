Die Tab-Container-Komponente fasst mehrere Inhaltsblöcke in einer Tab-Navigation zusammen.

Weil die Komponente eine der ältesten im Bestand ist, stehen zwei Mechaniken zur Verfügung, die Tab-Inhaltsblöcke mit Kindkomponenten zu bestücken: Eine sehr auf die Komponente zugeschnittene und eine allgemeine, wie man sie von anderen Komponenten aus kennt.

### 1. Die zugeschnittene Version

Als Erstes übergibt man per Eigenschaft `type` den Namen der Komponente, die den Tab-Inhaltsblöcke vorkommen soll, z.B. [`teaser-list-item`](#teaser-list-item). In der Eigenschaft `blocks` steckt man ein Array bestehend aus den Konfigurationen eines jeden Blocks. Eine solche einzelne Block-Konfiguration besteht wiederum aus folgenden Eigenschaften:

* `title`: Bezeichnung, die als Beschriftung des Tab-"Anfassers" genutzt wird
* `items`: Ein Array aus Eigenschaften-Objekten, die der einer `type` genannten Komponente als Daten übergeben werden
* `isNumeric`: Eine boolsche Eigenschaft, die nur eine Rolle spielt, wenn als Komponenten-`type` `teaser-list-item` angegeben wurde. In diesem Fall wird diese Eigenschaft an die Teaser-Liste weitergegeben und die wird dann zu einer nummerierten Liste.

### 2. Die Standardversion

Die Inhalte werden als Array von einzubindenden Kind-Komponenten in der `children`-Eigenschaft übergeben. Jeder Eintrag in diesem Array besteht aus einem Objekt mit den Eigenschaften `component` und `data`. `component` bezeichnet die in den Artikel-Inhalt einzuhängende Komponente und `data` bildet die Datenstruktur für diese Komponente ab, mit der diese Komponente befüttert werden soll.
