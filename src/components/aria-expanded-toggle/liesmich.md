In diesem Ordner lagert ein globales JavaScript, als alle semantisch entsprechend annotierten "Toggle"-Knöpfe zum Leben erweckt.

Folgende semantische Struktur wird erwartet:

1. Ein Zielobjekt, das getoggelt werden soll, das über eine eindeutige `id` und der boolschen Eigenschaft `aria-hidden` versehen sein muss. 
2. Ein `button`-Element mit der Eigenschaft `aria-controls`, die die `id` des Zielobjekts referenziert, und der boolschen Eigenschaft `aria-expanded`, die darstellt, ob das Zielobjekt gerade zu- oder aufgeklappt ist. `aria-expanded` verhält sich immer umgekehrt zu dem `aria-hidden`.  

Der Event-Handler, der diese Funktionalität bereitstellt, wird erst mit einer Verzögerung aufgeschaltet, so dass ein Komponenten-Autor die Möglichkeit hat, sich vorher mit einem individuellen Event-Handler an einen entsprechenden Knopf zu hängen, und den globalen Event-Handler per `.stopImmediatePropagation()` auf das Event außer Kraft zu setzen.