Dies ist eine generische Button-Komponente, die dafür Sorge trägt, dass alle Knöpfe überall gleich aussehen und gleich arbeiten. Folgende Dinge passieren hier:

* Falls eine `href`-Eigenschaft übergeben wird, wird der Knopf als `<a>`-Element erzeugt, ansonsten als `<button>`.
* Wenn als `href` ein `mailto:` übergeben wird, wird die E-Mail-Adresse verschleiert 
* Bei einer Kennzeichnung als Werbelink via `"isAd": true` bekommt der Knopf die Farbe für Werbung
* Bei einer Kennzeichnung als Werbelink via `"isAd": true` wird dieser in einem neuen Fenster geöffnet
* Bei einer Kennzeichnung als Werbelink via `"isAd": true` wird dieser nicht angezeigt, wenn übergeordnet ein `config.disableAds` auf `true` gesetzt ist (z.B. wenn ein zahlender Benutzer die seite betrachtet, oder wir uns in einem Advertorial befinden)
* Falls bei einem Link die `target`-Eigenschaft definiert wurde, wird automatisch auch `rel="noopener noreferrer nofollow"` gesetzt
* Weitere `rel`-Werte lassen sich bei Links konfigurieren
* Bei Buttons lässt sich der `type` definieren (z.B. "submit"). Default ist "button"
* Buttons lassen sich auf `disabled` setzen, per boolscher `disabled`-Eigenschaft
* Bei Buttons lassen sich über die `data`-Eigenschaft beliebig viele `data-`-eigenschaften ans HTML anfügen. Dafür muss die `data`-Eigenschaft mit einem Objekt gefüttert werden, bei dem die Keys zum Attributsnamen à la `data-key` werden und die Values als jeweiliger Wert zugerordnet werden  
* Mit Hilfe der `style`-Eigenschaft lässt sich der Knopf farblich auf folgende Varianten umschalten: `twitter`, `facebook`, `google-plus`, `whatsapp`, `bookmark` oder `comments`
* Mit Hilfe der `class`-Eigenschaft lässt sich ein SVG-Icon in den Knopf einbinden. Auch hier stehen `twitter`, `facebook`, `google-plus`, `whatsapp`, `bookmark` oder `comments` als Icons zur Verfügung
* Mit Hilfe der boolschen `ghost`-Eigenschaft lässt sich das Aussehen des Knopfs in einen Ghost-Knopf invertieren 
* Mit Hilfe der boolschen `loader`-Eigenschaft lässt sich der Knopf mit einem Ladespinner ausstatten

Bei einem Klick auf einen Knopf wird zu Tracking-Zwecken immer ein `park.button:click`-Event ausgelöst.